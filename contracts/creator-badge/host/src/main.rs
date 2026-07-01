use methods::{METHOD_ELF, METHOD_ID};
use risc0_zkvm::{default_prover, ExecutorEnv};
use risc0_zkvm::sha::Digestible;
use std::fs;
use std::path::Path;

fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::filter::EnvFilter::from_default_env())
        .init();

    // 1. Baca secret dari file
    let secret_path = Path::new("../../../issuer/creator_secret.hex");
    let secret_hex = fs::read_to_string(secret_path).expect("Gagal membaca creator_secret.hex");
    let secret_hex = secret_hex.trim();
    
    let mut secret = [0u8; 32];
    hex::decode_to_slice(secret_hex, &mut secret).expect("Secret bukan hex valid");

    // 2. Baca target contract ID dari argumen atau env (fallback ke ID dari M2)
    // Untuk testing, kita hardcode target yang sama dengan self_id di M2,
    // ATAU baca dari file
    let target_hex = std::env::var("TARGET_CONTRACT_ID_HEX")
        .expect("Set TARGET_CONTRACT_ID_HEX di environment");
    let mut target = [0u8; 32];
    hex::decode_to_slice(&target_hex, &mut target).expect("Target bukan hex valid");

    println!("Menjalankan Prover ZK...");
    let env = ExecutorEnv::builder()
        .write(&secret)
        .unwrap()
        .write(&target)
        .unwrap()
        .build()
        .unwrap();

    let prover = default_prover();
    let prove_info = prover
        .prove(env, METHOD_ELF)
        .unwrap();

    let receipt = prove_info.receipt;
    receipt.verify(METHOD_ID).unwrap();

    println!("Proof berhasil di-generate dan divalidasi lokal!");

    // Extract journal bytes & seal
    let journal_bytes = receipt.journal.bytes.clone();
    
    // Untuk mock verifier di Soroban, kita butuh `seal` khusus, tetapi karena ini Dev Mode,
    // risc0 default prover dalam dev mode menghasilkan seal dummy.
    // Namun mock verifier kita butuh format: selector(4 bytes) + claim_digest(32 bytes)
    // Di sini kita serialize receipt untuk dibaca oleh script penyerang/pengguna.
    
    // Karena kita butuh hex string dari seal dan journal untuk CLI, mari kita print:
    let claim_digest = receipt.claim().unwrap().digest();
    
    let mut mock_seal = vec![0u8, 0u8, 0u8, 0u8]; // selector 00000000
    mock_seal.extend_from_slice(claim_digest.as_bytes());
    
    let seal_hex = hex::encode(&mock_seal);
    let journal_raw_hex = hex::encode(&journal_bytes);
    
    println!("=== HASIL UNTUK CLAIM_BADGE ===");
    println!("seal_hex: {}", seal_hex);
    println!("journal_raw: {}", journal_raw_hex);
    
    fs::write("seal.txt", seal_hex).unwrap();
    fs::write("journal.txt", journal_raw_hex).unwrap();
}
