> [!IMPORTANT]
> This project has **not been audited**.

# Stellar RISC Zero Verifier - Operations & Upgrade Reference

This document outlines how to deploy, manage, and upgrade the RISC Zero Stellar verifier contracts. All operations use the `manage.sh` script, which interacts with the four core contracts: `TimelockController`, `VerifierRouter`, `EmergencyStop`, and the Verifier implementations (`Groth16Verifier` or `MockVerifier`).

> [!NOTE]
> All commands in this guide assume your current working directory is the root of the repository.

---

## 1. Environment Setup & Configuration

### Dependencies
* **Stellar CLI**: Install via `cargo install stellar-cli --locked`
* **Python**: Version 3.11+ (required for config management)
* **Rust**: Toolchain with `wasm32v1-none` target

### Configuration State (`deployment.toml`)
Deployment state lives in `deployment.toml` at the repository root. The `manage.sh` script updates this file automatically after each operation.

```toml
[chains.stellar-testnet]
name = "Stellar Testnet"
admin = "GABC..."
router = "CABC..."
timelock-controller = "CDEF..."
timelock-delay = 0

[[chains.stellar-testnet.verifiers]]
name = "groth16-verifier"
version = "1.2.0"
selector = "abc123de"
verifier = "CGHI..."
estop = "CJKL..."
unroutable = false
```

### Initial Account Setup (Optional)
If you need to create and fund a Stellar account for deployment on testnet:

```sh
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet
```

---

## 2. Core System Deployment

### Deploy the Timelocked Router
This operation deploys both the `TimelockController` and `VerifierRouter`. The router is immediately assigned to be owned by the timelock. The deployer receives the `proposer`, `executor`, and bootstrap `admin` roles on the timelock.

> [!IMPORTANT]
> Adjust `--min-delay` to a value appropriate for the environment (e.g., `0` for testing, `604800` for 7 days on mainnet).

```sh
./scripts/manage.sh deploy-router -n testnet -a deployer --min-delay 0
```

Verify the system status after deployment:
```sh
./scripts/manage.sh status -n testnet
```

---

## 3. Deploying & Upgrading Verifiers

When RISC Zero ships new verifier parameters (control IDs and/or Groth16 verification key), you must deploy a new Groth16 verifier version. Because the router dispatches by the first 4 bytes of the `seal` (the **selector**, which is derived from the parameters), different parameters result in a different selector. This ensures safe upgrades where multiple versions can coexist.

### Step 1: Update the Parameters File
Edit `contracts/groth16-verifier/parameters.json` with the new `control_root`, `version`, and `bn254_control_id`. This file is embedded at build time. The `build.rs` script derives the on-chain `selector()`, `version()`, constants, and the verification key from it.

### Step 2: Build and Confirm the New Selector
Compile the contracts to generate the new selector:

```bash
stellar contract build --optimize
```
You can confirm the selector from the build output or, after deployment, by querying the contract:
```bash
stellar contract invoke --send=no --network <net> --source <identity> --id <verifier_contract_id> -- selector
stellar contract invoke --send=no --network <net> --source <identity> --id <verifier_contract_id> -- version
```

### Step 3: Deploy the Verifier + Emergency Stop
Deploy the `Groth16Verifier` and its dedicated `EmergencyStop` wrapper. The verifier is recorded in `deployment.toml` as `unroutable=true` until explicitly added to the router.

> [!IMPORTANT]
> The emergency stop owner defaults to the deployer address (not the timelock). This ensures it can be activated immediately without delay. To set a different owner, append `--estop-owner <address>`.

```sh
./scripts/manage.sh deploy-verifier -n testnet -a deployer
```

### Step 4: Add the New Selector to the Router (Timelocked)
Adding the verifier to the router requires passing through the governance delay.

**Schedule the addition:**
```sh
./scripts/manage.sh schedule-add-verifier -n testnet -a deployer \
    --selector <selector>
```
*(Wait for the timelock delay to pass if `--min-delay` > 0)*

**Execute the addition:**
```sh
./scripts/manage.sh execute-add-verifier -n testnet -a deployer \
    --selector <selector>
```
Once executed, proofs carrying that selector will successfully verify through the router.

### Step 5: Handle Old Selectors
* **Routine upgrade (no vulnerability):** Keep older selectors active for backward compatibility as long as necessary.
* **Security deprecation:** Activate the emergency stop (immediate action) and schedule a removal via the timelock to permanently tombstone the selector.

---

## 4. Managing Verifiers

### Deploy a Mock Verifier (Testing Only)
> [!WARNING]
> The mock verifier provides no security guarantees and accepts any receipt matching the mock format. It cannot be deployed to mainnet.

```sh
./scripts/manage.sh deploy-mock-verifier -n testnet -a deployer
```
The selector defaults to `00000000`. To use a custom selector:
```sh
./scripts/manage.sh deploy-mock-verifier -n testnet -a deployer --selector deadbeef
```
*(Follow Step 4 above to add the mock verifier to the router).*

### Remove a Verifier (Tombstoning)
Removing a selector is a two-step, timelocked process. 
> [!CAUTION]
> Removal is permanent and irreversible. Once a selector is removed, it cannot be re-added.

**Schedule removal:**
```sh
./scripts/manage.sh schedule-remove-verifier -n testnet -a deployer \
    --selector <selector>
```

**Execute removal (after delay):**
```sh
./scripts/manage.sh execute-remove-verifier -n testnet -a deployer \
    --selector <selector>
```

### Activate the Emergency Stop
> [!WARNING]
> Activating the emergency stop **permanently** pauses the verifier. This cannot be undone.

By selector (automatically resolves the estop address from `deployment.toml`):
```sh
./scripts/manage.sh activate-estop -n testnet -a deployer \
    --selector <selector>
```

By specific estop contract ID:
```sh
./scripts/manage.sh activate-estop -n testnet -a deployer \
    --estop <estop-contract-id>
```

---

## 5. Governance & Timelock Administration

Self-administration operations (updating delays, managing roles) utilize an internal auth-entry flow. You can pass `--salt` (and optionally `--predecessor`) on both schedule and execute commands to disambiguate operations. Use a 64-character hex salt containing at least one letter (`a-f`) to prevent numeric parsing errors.

### Update the Timelock Minimum Delay
**Schedule:**
```sh
./scripts/manage.sh schedule-update-delay -n testnet -a deployer \
    --new-delay 3600
```
**Execute:**
```sh
./scripts/manage.sh execute-update-delay -n testnet -a deployer \
    --new-delay 3600
```

### Grant a Role
Supported roles: `proposer`, `executor`, `canceller`.

**Schedule:**
```sh
./scripts/manage.sh schedule-grant-role -n testnet -a deployer \
    --role executor --target-account GABC... \
    --salt abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
```
**Execute:**
```sh
./scripts/manage.sh execute-grant-role -n testnet -a deployer \
    --role executor --target-account GABC... \
    --salt abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
```

### Revoke a Role
**Schedule:**
```sh
./scripts/manage.sh schedule-revoke-role -n testnet -a deployer \
    --role executor --target-account GABC... \
    --salt fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321
```
**Execute:**
```sh
./scripts/manage.sh execute-revoke-role -n testnet -a deployer \
    --role executor --target-account GABC... \
    --salt fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321
```

> [!TIP]
> If scheduling fails with `Error(Contract, #4000)`, the operation hash is already scheduled. Either execute the existing operation or schedule with a new `--salt`, then pass the same `--salt` on execution.

### Renounce a Role
If a key is compromised, you can drop your own roles immediately with zero delay.
> [!WARNING]
> Renouncing roles on the timelock may make it permanently inoperable if no other accounts hold the required roles.

```sh
./scripts/manage.sh renounce-role -n testnet -a deployer --role proposer
```

### Cancel a Pending Operation
Requires the `canceller` role (proposers receive this automatically).

```sh
./scripts/manage.sh cancel-operation -n testnet -a deployer \
    --operation-id <op-id>
```

---

## 6. CLI Command Reference

Run `./scripts/manage.sh --help` for the full list of subcommands and flags.

| Command | Description |
|---------|-------------|
| `deploy-router` | Deploy timelock + router |
| `deploy-verifier` | Deploy groth16 verifier + emergency stop |
| `deploy-mock-verifier` | Deploy mock verifier (testing only) |
| `schedule-add-verifier` | Schedule adding a verifier to the router |
| `execute-add-verifier` | Execute the add-verifier operation |
| `schedule-remove-verifier` | Schedule removing a verifier |
| `execute-remove-verifier` | Execute the remove-verifier operation |
| `schedule-update-delay` | Schedule updating the timelock delay |
| `execute-update-delay` | Execute the delay update |
| `schedule-grant-role` | Schedule granting a role |
| `execute-grant-role` | Execute the grant-role operation |
| `schedule-revoke-role` | Schedule revoking a role |
| `execute-revoke-role` | Execute the revoke-role operation |
| `renounce-role` | Renounce a role (immediate, no timelock delay) |
| `cancel-operation` | Cancel a pending timelock operation |
| `activate-estop` | Activate the emergency stop (permanent) |
| `status` | Show deployment status of all contracts |