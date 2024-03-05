use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::ErrorCode;

#[account]
pub struct Config {
    pub admin: Pubkey,
    pub issue_price: u64,
    pub issue_amount: u64,
    pub proposal_fee: u64,
    pub max_supply: u64,
    pub min_quorum: u64,
    pub max_expiry: u64,
    pub proposal_count: u64,
    pub auth_bump: u8,
    pub config_bump: u8,
    pub mint_bump: u8,
    pub treasury_bump: u8,
}

impl Config {
    pub const LEN: usize = IDENTIFIER + PUBKEY_L + U64_L * 7 + U8_L * 4;
    pub fn init(
        &mut self,
        admin: Pubkey,
        issue_price: u64,
        issue_amount: u64,
        proposal_fee: u64,
        max_supply: u64,
        min_quorum: u64,
        max_expiry_days: u64,
        auth_bump: u8,
        config_bump: u8,
        mint_bump: u8,
        treasury_bump: u8,
    ) -> Result<()> {
        self.admin = admin;
        self.issue_price = issue_price;
        self.issue_amount = issue_amount;
        self.proposal_fee = proposal_fee;
        self.max_supply = max_supply;
        self.min_quorum = min_quorum;
        self.max_expiry = max_expiry_days.checked_mul(86400).ok_or(ErrorCode::Overflow)?;
        self.proposal_count = 0;
        self.auth_bump = auth_bump;
        self.config_bump = config_bump;
        self.mint_bump = mint_bump;
        self.treasury_bump = treasury_bump;
        Ok(())
    }

    pub fn add_proposal(&mut self) -> Result<()> {
        self.proposal_count = self.proposal_count.checked_add(1).ok_or(ErrorCode::Overflow)?;
        Ok(())
    }

    pub fn check_expiry_day(&self, expiry_days: u64) -> Result<()> {
        require!(self.max_expiry >= expiry_days.checked_mul(86400).ok_or(ErrorCode::Overflow)?, ErrorCode::InvalidMaxExpiry);
        Ok(())
    }

    pub fn check_quorom(&self, min_quorum: u64) -> Result<()> {
        require!(self.min_quorum <= min_quorum, ErrorCode::InvalidMinQuorum);
        Ok(())
    }
}