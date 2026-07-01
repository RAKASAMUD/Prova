use risc0_zkvm::{default_prover, ExecutorEnv};
use methods::{METHOD_ELF as ELF}; // The name in methods/guest/Cargo.toml is "method", so constant is METHOD_ELF
use shared::build_journal;

#[test]
fn dev_mode_journal_matches() {
    std::env::set_var("RISC0_DEV_MODE", "1");
    let secret = [7u8; 32];
    let target = [9u8; 32];
    let env = ExecutorEnv::builder()
        .write(&secret).unwrap()
        .write(&target).unwrap()
        .build().unwrap();
    let receipt = default_prover().prove(env, ELF).unwrap().receipt;
    assert_eq!(receipt.journal.bytes, build_journal(&secret, &target).to_vec());
    assert!(!receipt.journal.bytes.windows(32).any(|w| w == secret)); // no leak
}
