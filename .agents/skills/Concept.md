> [!IMPORTANT]
> This project has **not been audited**.

# Stellar RISC Zero Verifier - System Architecture & Context

On-chain RISC Zero proof verification for the Stellar network. The contract architecture mirrors the version-management pattern from `risc0-ethereum`. 

Soroban contracts can verify RISC Zero zkVM proofs on-chain through a single **router** address. Behind that address, verifier implementations can be added, paused, or removed over time. Applications always point at the same contract.

Three design priorities drove the architecture:
1. **Immutability at the leaf**: Verifier implementations are stateless with no admin functions.
2. **Governed mutability at the root**: The router is owned by a timelock, so changes to accepted verifiers are delayed and publicly observable.
3. **Independent emergency response**: Each verifier has its own emergency stop proxy controlled by a guardian (not the timelock) for immediate action.

---

## Contract Stack Architecture

```text
                    ┌─────────────────────┐
                    │  TimelockController │──── proposer / executor / canceller roles
                    │   (owns the router) │
                    └──────────┬──────────┘
                               │ owner
                    ┌──────────▼──────────┐
                    │   VerifierRouter    │──── routes verify() by 4-byte selector
                    └──────────┬──────────┘
                               │ selector lookup
              ┌────────────────┼─────────────────┐
              │                                  │
   ┌──────────▼──────────┐            ┌──────────▼──────────┐
   │   EmergencyStop     │            │   EmergencyStop     │
   │  (wraps verifier)   │            │  (wraps verifier)   │
   └──────────┬──────────┘            └──────────┬──────────┘
              │                                  │
   ┌──────────▼──────────┐            ┌──────────▼──────────┐
   │  Groth16Verifier    │            │  MockVerifier       │
   │  (production)       │            │  (testing only)     │
   └─────────────────────┘            └─────────────────────┘
```

---

## Core Components

### 1. TimelockController
Owns the router. Any privileged operation (adding/removing verifiers) must be scheduled through the timelock and can only execute after a configurable delay. The timelock is its own admin for self-targeting operations (delay updates, role grants/revocations), following the OpenZeppelin TimelockController pattern.

**Roles:**
* **Proposer**: Schedules operations.
* **Executor**: Executes operations once the delay passes.
* **Canceller**: Cancels pending operations (proposers receive this role automatically).
* **Bootstrap admin**: Optional initial admin for setup, which should be renounced once governance is in place.

### 2. VerifierRouter
Routes `verify(seal, image_id, journal_digest)` to the correct verifier based on a 4-byte **selector** prefix embedded in the `seal`. Internally, it maintains a `selector -> verifier address` mapping. This contract is strictly owned by the TimelockController.

### 3. EmergencyStop
A thin proxy wrapper around a specific verifier. A designated **guardian** (typically the deployer, not the timelock) can permanently pause it with zero delay. Once activated, the stop is **permanent** with no unpause functionality.

### 4. Verifier Implementations
* **Groth16Verifier**: Stateless and immutable. Verifies RISC Zero Groth16 proofs over the BN254 curve. The parameters (control IDs, verification key) are baked in at build time from `contracts/groth16-verifier/parameters.json`, and the 4-byte selector is derived from their hash.
* **MockVerifier**: Test-only implementation with no cryptographic checks. It utilizes a fixed selector (typically `00000000`) and cannot be deployed to mainnet.

---

## System Mechanics & Integration

### Selector Routing Lifecycle
The first 4 bytes of the `seal` act as the **selector**. When `router.verify(seal, image_id, journal_digest)` is invoked, the following execution path occurs:
1. Extract `seal[0..4]` to identify the selector.
2. Look up the corresponding verifier address mapped to that selector.
3. Forward the verification call through the specific EmergencyStop proxy to the underlying verifier.

This mechanism allows **multiple verifier versions to coexist** behind a single router address. When RISC Zero releases new parameters, a new verifier is deployed with a new selector. New proofs route to the new verifier, while historical proofs continue to route to the older verifier.

### Selector Tombstoning
A selector maps to exactly one verifier. Removing a selector is a timelocked (schedule/execute) and irreversible operation. Once removed (tombstoned), the selector can **never** be re-registered, even with the same verifier address. This ensures that if a governance key is compromised, an attacker cannot silently swap a malicious verifier behind a previously trusted selector.

### Governance Model
Every modification to the VerifierRouter requires a strict three-step timelocked process:
1. **Schedule**: A proposer submits the operation, initiating the delay timer.
2. **Wait**: A mandatory delay period passes, allowing developers and auditors time to review. During this window, a canceller can abort the operation.
3. **Execute**: An executor runs the operation, officially updating the router state.

**Delay Configuration:**
* **Dev/testing**: `min_delay = 0` (immediate execution).
* **Production**: A meaningful duration (e.g., 7 days).
* **Self-administration**: Operations targeting the timelock itself (e.g., updating the delay) undergo the same schedule, but execution is routed through the timelock's internal authorization (`__check_auth` with `OperationMeta`) instead of an external call.

### Emergency Stop Design
The emergency stop mechanism is deliberately isolated from the timelock to allow immediate action during a crisis. A delay is appropriate for governance but detrimental during an active exploit.

**Trigger Methods:**
1. **Guardian call**: The guardian invokes `estop()` directly.
2. **Proof of exploit**: Anyone can submit a "known-bad" proof that the verifier would incorrectly accept, cryptographically proving the vulnerability on-chain.

**Post-Activation State:**
Making the stop permanent ensures that a compromised guardian key cannot toggle a vulnerable verifier back online. After activation, the selector remains in the router's mapping, but all verification calls routed through it will revert. The operator is then expected to schedule a formal removal via the timelock to tombstone the compromised selector.