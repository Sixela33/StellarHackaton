use soroban_sdk::{contracttype, Address, Vec, String};

use crate::storage::types::storage::{CampaignStatus, MilestoneStatus};

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Milestone {
    pub description: String,
    pub status: MilestoneStatus,
    pub evidence: String,
    pub approved: bool,
    pub amount: i128,
    pub reciever: Address
}

#[derive(Clone)]
#[contracttype]
pub struct Campaign {
    pub goal: i128,
    pub distributed: i128,
    pub min_donation: i128,
    pub total_raised: i128,
    pub supporters: u32,
    pub milestones: Vec<Milestone>,
    pub status: CampaignStatus
}
