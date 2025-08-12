use soroban_sdk::{contracttype, Address};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    Campaign(Address), // Para buscar campañas por su administrador
    Contribution(Address, Address), // (campaign_address, contributor)
}