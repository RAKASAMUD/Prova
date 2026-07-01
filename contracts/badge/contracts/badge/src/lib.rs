#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env};

#[contracttype]
pub struct BadgeData { pub minted_ledger: u32 }

#[contracttype]
pub struct Config {
    pub trusted_image_id: BytesN<32>,
    pub router: Address,
    pub self_id: BytesN<32>,
    pub admin: Address,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Config,
    ValidCommitment(BytesN<32>),
    UsedNullifier(BytesN<32>),
    Badge(Address),
}

#[contract]
pub struct BadgeContract;

#[contractimpl]
impl BadgeContract {
    pub fn initialize(env: Env, admin: Address, trusted_image_id: BytesN<32>,
                      router: Address, self_id: BytesN<32>) {
        if env.storage().instance().has(&DataKey::Config) { panic!("init") }
        env.storage().instance().set(&DataKey::Config,
            &Config { trusted_image_id, router, self_id, admin });
    }
    
    pub fn register_commitment(env: Env, commitment: BytesN<32>) {
        let cfg: Config = env.storage().instance().get(&DataKey::Config).unwrap();
        cfg.admin.require_auth();
        env.storage().persistent().set(&DataKey::ValidCommitment(commitment), &true);
    }
}

pub struct Journal {
    pub eligible: bool,
    pub commitment: BytesN<32>,
    pub nullifier: BytesN<32>,
    pub target: BytesN<32>,
}

fn slice32(raw: &soroban_sdk::Bytes, start: u32) -> [u8; 32] {
    let mut a = [0u8; 32];
    raw.slice(start..start + 32).copy_into_slice(&mut a);
    a
}

pub fn parse_journal(env: &Env, raw: &soroban_sdk::Bytes) -> Journal {
    if raw.len() != 97 { panic!("journal len") }
    Journal {
        eligible:   raw.get(0).unwrap() == 1,
        commitment: BytesN::from_array(env, &slice32(raw, 1)),
        nullifier:  BytesN::from_array(env, &slice32(raw, 33)),
        target:     BytesN::from_array(env, &slice32(raw, 65)),
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn init_and_register() {
        let env = Env::default();
        let contract = env.register(BadgeContract, ());
        let c = BadgeContractClient::new(&env, &contract);
        let admin = Address::generate(&env);
        let img = BytesN::from_array(&env, &[1u8; 32]);
        let router = Address::generate(&env);
        let self_id = BytesN::from_array(&env, &[2u8; 32]);
        c.initialize(&admin, &img, &router, &self_id);
        let cm = BytesN::from_array(&env, &[9u8; 32]);
        env.mock_all_auths();
        c.register_commitment(&cm);
        // assert lewat claim di Task 3.
    }

    #[test]
    fn parse_layout() {
        let env = Env::default();
        let mut v = [0u8; 97];
        v[0] = 1;
        for i in 1..33  { v[i] = 0xAA }
        for i in 33..65 { v[i] = 0xBB }
        for i in 65..97 { v[i] = 0xCC }
        let raw = soroban_sdk::Bytes::from_array(&env, &v);
        let j = super::parse_journal(&env, &raw);
        assert!(j.eligible);
        assert_eq!(j.commitment, BytesN::from_array(&env, &[0xAA; 32]));
        assert_eq!(j.nullifier,  BytesN::from_array(&env, &[0xBB; 32]));
        assert_eq!(j.target,     BytesN::from_array(&env, &[0xCC; 32]));
    }
}
