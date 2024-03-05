use anchor_lang::prelude::*;
use crate::constants::*;

#[account]
pub struct Auth {
}

impl Auth {
    pub const LEN: usize = IDENTIFIER;
}