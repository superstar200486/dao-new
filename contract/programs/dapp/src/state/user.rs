use anchor_lang::prelude::*;
use crate::{constants::*, error::ErrorCode};

#[account]
pub struct User {
    pub pubkey: Pubkey,
    pub name: String,
    pub status: UserStatus,
    pub user_bump: u8,
}

impl User {
    pub const LEN: usize = IDENTIFIER + PUBKEY_L + FIELD_IDENTIFIER + USERNAME_L + ENUM_L + OPTION_L + U8_L;

    pub fn create_account(&mut self, userkey: Pubkey, name: String, user_bump: u8) -> Result<()> {
        require!(name.len() <= 20, ErrorCode::InvalidUsername);
        self.pubkey = userkey;
        self.name = name;
        self.status = UserStatus::Init;
        self.user_bump = user_bump;
        Ok(())
    }

    pub fn activate_user(&mut self) -> Result<()> {
        self.status = UserStatus::Active;
        Ok(())
    }

    pub fn disable_user(&mut self) -> Result<()> {
        self.status = UserStatus::Disable;
        Ok(())
    }

    pub fn check_active(&self) -> Result<()> {
        require!(self.status == UserStatus::Active, ErrorCode::InActiveUser);
        Ok(())
    }
}
#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, Debug, PartialEq, Eq)]
pub enum UserStatus {
    Init,
    Active,
    Disable,
}