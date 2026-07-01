#![no_std]
pub const JOURNAL_LEN: usize = 97;

// Placeholder for build_journal and sha256 so the test can compile (but will fail assertion or logic later, actually wait, the M1 step 1 wants to implement the failing test. I'll just write the test first as instructed, but in Rust the test won't compile without the function signature. Let's provide the signature.)

pub fn sha256(input: &[u8]) -> [u8; 32] {
    [0; 32] // dummy
}

pub fn build_journal(secret: &[u8; 32], target: &[u8; 32]) -> [u8; JOURNAL_LEN] {
    [0; JOURNAL_LEN] // dummy
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
