#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

// Constants for Time-To-Live (TTL) management
const MIN_TTL: u32 = 17280;    // ~1 day threshold
const EXTEND_TO: u32 = 518400; // Extend to ~30 days

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    TicketCount,
    Ticket(u64),
}

#[contracttype]
#[derive(Clone)]
pub struct Ticket {
    pub id: u64,
    pub event_name: String,
    pub owner: Address,
    pub price: u64,
    pub max_price: u64,
    pub is_valid: bool,
}

#[contract]
pub struct TicketContract;

#[contractimpl]
impl TicketContract {
    // Mints a new ticket, increments the global count, and saves it to persistent storage
    pub fn mint_ticket(env: Env, event_name: String, price: u64, max_price: u64) -> u64 {
        let count_key = DataKey::TicketCount;
        let mut count: u64 = env.storage().persistent().get(&count_key).unwrap_or(0);
        count += 1;

        let ticket = Ticket {
            id: count,
            event_name,
            owner: env.current_contract_address(),
            price,
            max_price,
            is_valid: true,
        };

        let ticket_key = DataKey::Ticket(count);

        // Write and extend TTL for the counter
        env.storage().persistent().set(&count_key, &count);
        env.storage().persistent().extend_ttl(&count_key, MIN_TTL, EXTEND_TO);

        // Write and extend TTL for the new ticket
        env.storage().persistent().set(&ticket_key, &ticket);
        env.storage().persistent().extend_ttl(&ticket_key, MIN_TTL, EXTEND_TO);

        count
    }

    // Transfers ticket ownership while enforcing the anti-scalping max price limit
    pub fn transfer_ticket(env: Env, id: u64, new_owner: Address, resale_price: u64) -> String {
    let key = DataKey::Ticket(id);
    
    let mut ticket: Ticket = match env.storage().persistent().get::<DataKey, Ticket>(&key) {
        Some(t) => t,
        None => return String::from_str(&env, "Ticket not found"),
    };

    if resale_price > ticket.max_price {
        return String::from_str(&env, "Resale price exceeds maximum allowed price");
    }

    ticket.owner = new_owner;
    ticket.price = resale_price;

    env.storage().persistent().set(&key, &ticket);
    env.storage().persistent().extend_ttl(&key, MIN_TTL, EXTEND_TO);

    String::from_str(&env, "Transfer successful")
}

    // Returns the validity status of a specific ticket ID
    pub fn verify_ticket(env: Env, id: u64) -> bool {
    let key = DataKey::Ticket(id);
    if let Some(ticket) = env.storage().persistent().get::<DataKey, Ticket>(&key) {
        ticket.is_valid
    } else {
        false
    }
}
}