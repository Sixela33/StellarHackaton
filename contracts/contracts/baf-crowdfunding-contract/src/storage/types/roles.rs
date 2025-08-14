use soroban_sdk::contracttype;

#[derive(Clone, Debug, PartialEq, Eq)]
#[contracttype]
#[repr(u32)]
pub enum Role {
    JUDGE = 0,
}