use soroban_sdk::{Address, Env};

use crate::{
    events,
    methods::token::token_transfer,
    storage::{
        campaign::{
            get_campaign, 
            remove_campaign
        }, 
        contribution::remove_contribution, 
        types::error::Error
    }
};

pub fn withdraw(env: &Env, campaign_id: u32, sender: Address) -> Result<(), Error> {

    let campaign = get_campaign(env, &campaign_id)?;

    // TODO: Chech the sender can claim the milestone

    if campaign.total_raised != campaign.goal {
        return Err(Error::CampaignGoalNotReached);
    }

    token_transfer(
        &env,
        &env.current_contract_address(),
        &sender,
        &campaign.total_raised
    )?;

    remove_campaign(env, &campaign_id);
    let contributors = campaign.supporters_list;
    for i in 0 .. contributors.len() {
        if let Some(contributor) = contributors.get(i) {
            remove_contribution(env, &campaign_id, &contributor);
        }
    }

    events::campaign::withdraw(&env, &campaign_id, campaign.total_raised);
    
    Ok(())   
}