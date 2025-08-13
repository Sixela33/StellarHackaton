use soroban_sdk::{contracttype, Address};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    Campaign(u32), // Para buscar campañas por su administrador
    Contribution(u32, Address), // (campaign_id, contributor)
    Role(Address, u32), // (user_address, campaign_id)
    CampainID
}