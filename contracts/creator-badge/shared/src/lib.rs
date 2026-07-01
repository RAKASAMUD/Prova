#![no_std]
use sha2::{Sha256, Digest};
pub const JOURNAL_LEN: usize = 97;

pub fn sha256(input: &[u8]) -> [u8; 32] {
    let mut h = Sha256::new(); h.update(input); h.finalize().into()
}

pub fn build_journal(secret: &[u8; 32], target: &[u8; 32]) -> [u8; JOURNAL_LEN] {
    let commitment = sha256(secret);
    let mut cat = [0u8; 64];
    cat[..32].copy_from_slice(secret);
    cat[32..].copy_from_slice(target);
    let nullifier = sha256(&cat);
    let mut j = [0u8; JOURNAL_LEN];
    j[0] = 1;
    j[1..33].copy_from_slice(&commitment);
    j[33..65].copy_from_slice(&nullifier);
    j[65..97].copy_from_slice(target);
    j
}

#[cfg(test)]
mod tests {
    use super::*;
    use sha2::{Sha256, Digest};

    // We redefine a correct sha256 for the test to verify against the dummy one
    fn real_sha256(input: &[u8]) -> [u8; 32] {
        let mut h = Sha256::new();
        h.update(input);
        h.finalize().into()
    }

    #[test]
    fn journal_layout_and_hashes() {
        let secret = [7u8; 32];
        let target = [9u8; 32];
        let j = build_journal(&secret, &target);
        
        assert_eq!(j.len(), JOURNAL_LEN);
        assert_eq!(j[0], 1);
        assert_eq!(&j[1..33],  &real_sha256(&secret)[..]);
        
        let mut cat = secret.to_vec(); 
        cat.extend_from_slice(&target);
        assert_eq!(&j[33..65], &real_sha256(&cat)[..]);
        assert_eq!(&j[65..97], &target[..]);
        
        // secret tak bocor
        assert!(!j.windows(32).any(|w| w == secret));
    }
}
