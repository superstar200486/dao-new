use anchor_lang::prelude::*;
use crate::constants::*;

#[account]
pub struct Treasury {
}

impl Treasury {
    pub const LEN: usize = IDENTIFIER;
}