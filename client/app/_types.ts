import { web3 } from "@coral-xyz/anchor"

export type Config = {
    issue_price: number,
    issue_amount: number,
    proposal_fee: number,
    min_quorum: number,
    max_expiry: number,
    proposal_count: number,
    admin: boolean,
    user: User | undefined,
}

export type User = {
    name: String,
    status: String,
}

export type Member = {
    accKey: web3.PublicKey,
    userkey: web3.PublicKey,
    name: string,
    status: string,
}

export interface Proposal {
    id: number,
    pubkey: web3.PublicKey,
    title: String,
    desc: String,
    created_at: string,
    max_expiry: string,
    min_quorum: number,
    status: string,
    quorum: number,
    creator: web3.PublicKey,
}

export interface ProposalForVote extends Proposal {
    voted?: boolean,
}

export interface OwnProposals {
    inactive: Proposal[],
    active: Proposal[],
    completed: Proposal[],
    failed: Proposal[],
}