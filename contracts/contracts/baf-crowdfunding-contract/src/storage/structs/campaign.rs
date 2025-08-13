use soroban_sdk::{contracttype, Address, Vec, String};

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Milestone {
    pub description: String,
    pub status: String,
    pub evidence: String,
    pub approved: bool,
    pub amount: i128
}

#[derive(Clone)]
#[contracttype]
pub struct Campaign {
    pub goal: i128,
    pub min_donation: i128,
    pub total_raised: i128,
    pub supporters: u32,
    pub supporters_list: Vec<Address>,
    pub milestones: Vec<Milestone>
}
