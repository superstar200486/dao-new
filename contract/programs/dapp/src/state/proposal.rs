use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::ErrorCode;

#[account]
pub struct Proposal {
    pub creator: Pubkey,
    pub status: ProposalStatus,
    pub id: u64,
    pub title: String,
    pub desc: String,
    pub created_at: u64,
    pub max_expiry: u64,
    pub min_quorum: u64,
    pub quorum: u64,
    pub proposal_bump: u8,
}

impl Proposal {
    pub const LEN: usize = IDENTIFIER 
        + PUBKEY_L
        + FIELD_IDENTIFIER + PROPOSAL_TITLE_L 
        + FIELD_IDENTIFIER + PROPOSAL_DESC_L 
        + U64_L * 5 
        + ENUM_L + OPTION_L 
        + U8_L;

    pub fn init(
        &mut self,
        id: u64,
        title: String,
        desc: String,
        expiry_days: u64,
        min_quorum: u64,
        proposal_bump: u8,
        creator: Pubkey,
    ) -> Result<()> {

        let title_len = title.len();
        let desc_len = desc.len();

        require!(title_len > 0 && PROPOSAL_TITLE_L >= title_len, ErrorCode::InvalidTitleLength);
        require!(desc_len > 0 && PROPOSAL_DESC_L >= desc_len, ErrorCode::InvalidDescLength);
        
        let current_timestamp = Clock::get()?.slot;
        let expiry_seconds = expiry_days * 86400;
        let max_expiry = current_timestamp.checked_add(expiry_seconds).ok_or(ErrorCode::Overflow)?;

        self.id = id;
        self.title = title;
        self.desc = desc;
        self.created_at = current_timestamp;
        self.max_expiry = max_expiry;
        self.min_quorum = min_quorum;
        self.quorum = 0;
        self.status = ProposalStatus::Inactive;
        self.proposal_bump = proposal_bump;
        self.creator = creator;
        Ok(())
    }

    pub fn approve_proposal(&mut self) -> Result<()> {
        self.status = ProposalStatus::Active;

        Ok(())
    }

    pub fn check_active(&self) -> Result<()> {
        require!(self.status == ProposalStatus::Active, ErrorCode::InActiveProposal);

        Ok(())
    }

    pub fn check_expiry(&self) -> Result<()> {
        let current_timestamp = Clock::get()?.slot;
        
        require!(self.max_expiry >= current_timestamp, ErrorCode::Expired);

        Ok(())
    }

    pub fn check_quorum(&self) -> Result<()> {
        require!(self.quorum >= self.min_quorum, ErrorCode::NotEnoughQuorum);

        Ok(())
    }

    pub fn vote(&mut self) -> Result<()> {
        self.check_active()?;
        self.quorum = self.quorum.checked_add(1).ok_or(ErrorCode::Overflow)?;

        Ok(())
    }

    pub fn complete_proposal(&mut self) -> Result<()> {
        self.check_quorum()?;
        self.check_expiry()?;

        self.status = ProposalStatus::Completed;

        Ok(())
    }

    pub fn close_proposal(&mut self) -> Result<()> {
        require!(self.status != ProposalStatus::Completed, ErrorCode::Finished);
        require!(self.status != ProposalStatus::Failed, ErrorCode::Finished);
        self.status = ProposalStatus::Failed;

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, Debug, PartialEq, Eq)]
pub enum ProposalStatus {
    Inactive,
    Active,
    Completed,
    Failed,
}