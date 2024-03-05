use anchor_lang::prelude::*;
use crate::constants::*;

#[account]
pub struct UserVote {
    pub voter: Pubkey,
    pub proposal: Pubkey,
}

impl UserVote {
    pub const LEN: usize = IDENTIFIER + PUBKEY_L * 2;

    pub fn vote(&mut self, voter: Pubkey, proposal: Pubkey) -> Result<()> {

        self.voter = voter;
        self.proposal = proposal;

        Ok(())
    }

}
