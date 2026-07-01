use risc0_zkvm::guest::env;
use shared::build_journal;

fn main() {
    let secret: [u8; 32] = env::read();
    let target: [u8; 32] = env::read();
    let journal = build_journal(&secret, &target);
    env::commit_slice(&journal); // raw bytes, TIDAK env::commit (hindari serde encoding)
}
