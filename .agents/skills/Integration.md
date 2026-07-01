> [!IMPORTANT]
> `main` is the development branch of RISC Zero. When building applications or running examples, use the latest release instead. This document serves as the machine-readable context for the RISC Zero protocol and the Stellar Groth16 Verifier upgrade lifecycle.

# RISC Zero & Stellar Groth16 Verifier - Protocol Context & Upgrade Guide

RISC Zero is a zero-knowledge verifiable general computing platform based on zk-STARKs and the RISC-V microarchitecture. A zero knowledge proof allows one party (the prover) to convince another party (the verifier) that something is true without revealing all the details. In the case of RISC Zero, the prover can show that they correctly executed some code (known to both parties), while only revealing to the verifier the output of the code, not any of its inputs or any state during execution.

The code runs in a special virtual machine, called a _zkVM_. The RISC Zero zkVM emulates a small RISC-V computer, allowing it to run arbitrary code in any language, so long as a compiler toolchain exists that targets RISC-V (SDK support currently exists for Rust, C, and C++).

---

## 1. Protocol Overview and Terminology

* **Method:** The code to be proven, compiled from its implementation language into a RISC-V ELF file with a special entry point that runs the code.
* **Image ID:** A special type of cryptographic hash of the ELF file, required for verification.
* **Host & Guest:** The logical RISC-V machine running inside the zkVM is called the _guest_, and the prover running the zkVM is called the _host_. They communicate during execution, but the host cannot modify the guest's execution, or the proof becomes invalid.
* **Journal:** An append-only log written to by the guest code during execution, representing the official output of the computation.
* **Receipt:** Produced upon correct termination of the method. It acts as the zero-knowledge proof of correct execution and consists of 2 parts: 
    1. The **journal** (written during execution).
    2. The **seal** (a blob of opaque cryptographic data).
* **Verification:** The verifier examines the receipt. If tampering occurred to the journal or seal, verification fails. It is cryptographically infeasible to generate a valid receipt unless the journal's output exactly matches a valid execution of the method whose image ID matches the receipt.

### Security Model
The system implements a three-layer recursive proof system based on the well-studied zk-STARK protocol and Groth16 protocol. With default parameters, this system achieves perfect zero-knowledgeness and 98 bits of conjectured security. A soundness/security calculator is included in the `soundness.rs` file (run via `RUST_LOG=risc0_zkp=debug` during proof generation).

---

## 2. Setup & Toolchain (`rzup`)

To start a new project, use the `cargo risczero` tool to write the initial boilerplate and set up a standard directory structure.

**Install the RISC Zero toolchain installer (`rzup`):**
```bash
curl -L [https://risczero.com/install](https://risczero.com/install) | bash
```

**Install the toolchain:**
```bash
rzup install
```

**Verify installation:**
```bash
cargo risczero --version
```

**Create a new project:**
```bash
cargo risczero new my_project
```

---

## 3. Rust Ecosystem & Libraries

### Core Binaries
* `cargo-risczero`: Toolchain and project scaffolding.
* `risc0-r0vm`: The standalone virtual machine runner.
* `risc0-tools`: Internal developer tools.

### Core Libraries
* `bonsai-sdk`: SDK for interacting with the Bonsai proving service.
* `risc0-binfmt`: Binary format parsing for RISC-V ELFs.
* `risc0-build` / `risc0-build-kernel`: Build configurations and kernel compilation.
* `risc0-circuit-recursion` / `risc0-circuit-recursion-sys`: Recursive circuit definitions.
* `risc0-circuit-rv32im` / `risc0-circuit-rv32im-sys`: RV32IM circuit implementations.
* `risc0-core`: Core primitives and traits.
* `risc0-groth16`: Groth16 proof generation and verification logic.
* `risc0-sys`: System-level bindings.
* `risc0-zkp`: Zero-knowledge proof cryptographic primitives.
* `risc0-zkvm` / `risc0-zkvm-platform`: The main zkVM SDK and platform definitions.

### Feature Flags
* `client`: Enables the client API. (Crate: `risc0-zkvm`. Implies: `std`).
* `cuda`: Enables CUDA GPU acceleration for the prover. (Crates: `risc0-circuit-recursion`, `risc0-circuit-rv32im`, `risc0-zkp`, `risc0-zkvm`. Implies: `prove`, `std`).
* `disable-dev-mode`: Disables dev mode so proving/verifying cannot be faked. Prevents a misplaced `RISC0_DEV_MODE` from breaking security. (Crate: `risc0-zkvm`).
* `metal`: Deprecated - Metal GPU acceleration is enabled by default on Apple Silicon.
* `prove`: Enables the prover; incompatible within the zkvm guest. (Crates: `risc0-circuit-recursion`, `risc0-circuit-rv32im`, `risc0-zkp`, `risc0-zkvm`. Implies: `std`).
* `std`: Support for the Rust standard library.

---

## 4. Stellar Groth16 Verifier: Upgrade Implementation

When RISC Zero ships new verifier parameters (control IDs and/or Groth16 verification key), you must deploy a new Groth16 verifier version with a new selector on the Stellar network.

### Why upgrades create a new selector
The Stellar Verifier Router dispatches calls based on the first 4 bytes of the `seal` (the selector), which is cryptographically derived from the verifier parameters. Different parameters result in a different selector. This means:
* Multiple verifier versions coexist securely behind one router address.
* Upgrades are safe: you add the new selector via timelock, and optionally deprecate the old ones.

### Step 1: Update the parameters file
Edit `contracts/groth16-verifier/parameters.json` with the new `control_root`, `version`, and `bn254_control_id`. 
This file gets embedded at build time. The Groth16 verifier’s `build.rs` script derives everything from it:
* The `selector()` and `version()` exposed on-chain.
* The control root / control ID constants.
* The Groth16 verification key.

### Step 2: Build and confirm the new selector
```bash
stellar contract build --optimize
```
The build runs `build.rs` which computes the selector. You can confirm it from the build output (it prints the selector) or, after deployment, by querying the contract:

```bash
stellar contract invoke --send=no --network <net> --source <identity> --id <verifier_contract_id> -- selector
stellar contract invoke --send=no --network <net> --source <identity> --id <verifier_contract_id> -- version
```

### Step 3: Deploy the new verifier & emergency stop
```bash
./scripts/manage.sh deploy-verifier -n <network> -a <identity>
```
This deploys the Groth16 verifier and an emergency-stop wrapper around it (the guardian defaults to the deployer; override with `--estop-owner`). The verifier is recorded in `deployment.toml` as `unroutable=true` until it is formally added to the router.

### Step 4: Add the new selector to the router (Timelocked)
```bash
# 1. Schedule the addition
./scripts/manage.sh schedule-add-verifier -n <network> -a <identity> --selector <selector>

# 2. Execute the addition (after the timelock delay has passed)
./scripts/manage.sh execute-add-verifier -n <network> -a <identity> --selector <selector>
```
Once executed, proofs carrying that new selector will verify successfully through the router.

### Step 5: Handle legacy selectors
* **Routine upgrade (no vulnerability):** Keep older selectors active in the router for backward compatibility as long as necessary.
* **Security deprecation:** Activate the emergency stop (which takes immediate effect), and/or schedule a removal of the selector from the router via the timelock to permanently tombstone it.

> [!CAUTION]
> Removal via the router is irreversible. Once a selector is tombstoned, it cannot be re-added under any circumstances.