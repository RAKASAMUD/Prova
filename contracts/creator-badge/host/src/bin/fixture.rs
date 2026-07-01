use risc0_zkvm::{default_prover, compute_image_id, ExecutorEnv, ProverOpts};
use methods::METHOD_ELF as ELF;
use std::fs;

fn h(s: &str) -> [u8; 32] {
    let mut a = [0u8; 32];
    a.copy_from_slice(&hex::decode(s.trim()).unwrap());
    a
}

fn main() {
    let secret = h(&std::env::var("SECRET_HEX").expect("SECRET_HEX must be set"));
    let target = h(&std::env::var("TARGET_HEX").expect("TARGET_HEX must be set"));
    let selector_hex = std::env::var("SELECTOR_HEX").expect("SELECTOR_HEX must be set");
    let selector = hex::decode(selector_hex.trim()).expect("Invalid SELECTOR_HEX");
    
    if selector.len() != 4 {
        panic!("SELECTOR_HEX must be exactly 4 bytes (8 hex chars)");
    }

    println!("Building ExecutorEnv...");
    let env = ExecutorEnv::builder()
        .write(&secret)
        .unwrap()
        .write(&target)
        .unwrap()
        .build()
        .unwrap();

    println!("Starting Groth16 proving...");
    let receipt = default_prover()
        .prove_with_opts(env, ELF, &ProverOpts::groth16())
        .expect("Proving failed")
        .receipt;

    println!("Verifying locally...");
    let image_id = compute_image_id(ELF).unwrap();
    receipt.verify(image_id).expect("Local verification failed");

    fs::create_dir_all("out").unwrap();
    
    // Save Journal
    let journal_bytes = &receipt.journal.bytes;
    fs::write("out/journal.hex", hex::encode(journal_bytes)).unwrap();
    
    // Save Image ID
    let image_id_bytes: [u8; 32] = image_id.into();
    fs::write("out/image_id.hex", hex::encode(image_id_bytes)).unwrap();
    
    // Encode Seal (Selector 4B + Groth16 Proof 256B)
    let inner_seal = receipt.inner.groth16().expect("Expected Groth16 receipt").seal.clone();
    if inner_seal.len() != 256 {
        panic!("Unexpected Groth16 seal length: {}", inner_seal.len());
    }
    
    let mut seal = Vec::with_capacity(4 + 256);
    seal.extend_from_slice(&selector);
    seal.extend_from_slice(&inner_seal);
    
    fs::write("out/seal.hex", hex::encode(&seal)).unwrap();
    
    println!("IMAGE_ID={}", hex::encode(image_id_bytes));
    println!("Proving complete. Artifacts saved to out/ directory.");
}
