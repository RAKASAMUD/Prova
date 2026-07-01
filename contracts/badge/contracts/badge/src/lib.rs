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
}
