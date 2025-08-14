use soroban_sdk::{Address, Env};

use crate::storage::{roles::{
    remove_role, 
    set_role
}, 
types::{error::Error, roles::Role}
};

pub fn set_judge(env: Env, user: Address) -> Result<(), Error> {
    set_role(&env, Role::JUDGE, user);
    Ok(())
}

pub fn remove_judge(env: Env, user: Address)-> Result<(), Error> {
    remove_role(&env, Role::JUDGE, user);
    Ok(())
}
