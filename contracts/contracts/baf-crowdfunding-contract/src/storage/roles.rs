use soroban_sdk::{Address, Env};

use crate::storage::types::roles::Role;

use super::types::storage::DataKey;

pub(crate) fn has_role(env: &Env, role:Role, user:Address) -> bool {
    let key = DataKey::Role(role, user);

    env.storage().instance().has(&key)
}

pub(crate) fn set_role(env: &Env, role: Role, user: Address) {
    let key = DataKey::Role(role, user);

    env.storage().instance().set(&key, &true);
}

pub(crate) fn remove_role(env: &Env, role: Role, user: Address) {
    let key = DataKey::Role(role, user);

    env.storage().instance().remove(&key);
}