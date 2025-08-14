use soroban_sdk::{contracttype, Address};

use crate::storage::types::roles::Role;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    Campaign(u32), // Para buscar campañas por su administrador
    Contribution(u32, Address), // (campaign_id, contributor)
    Role(Role, Address), // (user_address, campaign_id)
    CampainID
}
#[derive(Clone, Debug, PartialEq, Eq)]
#[contracttype]
#[repr(u32)]
pub enum MilestoneStatus {
    AVAILABLE = 0,
    REQUESTED = 1,
    FREED = 2
}

#[derive(Clone, Debug, PartialEq, Eq)]
#[contracttype]
#[repr(u32)]
pub enum CampaignStatus {
    RUNNING = 0,
    COMPLETE = 1,
    CANCELED = 2
}