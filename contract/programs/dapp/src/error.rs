use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("invalid username!")]
    InvalidUsername,
    #[msg("inactive user")]
    InActiveUser,
    #[msg("invalid title length")]
    InvalidTitleLength,
    #[msg("invalid desc length")]
    InvalidDescLength,
    #[msg("invalid min quorum")]
    InvalidMinQuorum,
    #[msg("invalid max expiry")]
    InvalidMaxExpiry,
    #[msg("Overflow")]
    Overflow,
    #[msg("Invalid slot")]
    InvalidSlot,
    #[msg("proposal is not activated")]
    InActiveProposal,
    #[msg("not enough quorum")]
    NotEnoughQuorum,
    #[msg("expired")]
    Expired,
    #[msg("already finished")]
    Finished,
}