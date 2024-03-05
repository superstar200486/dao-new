import { PublicKey } from "@solana/web3.js";
import { Proposal, ProposalForVote } from "../_types";
import { OwnProposals } from "../_types";
import { ProgramId } from "../_constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export const getStatus = (user: any) => Object.keys(user.account.status)[0].toLowerCase();

export const getProposalStatus = (proposal: any) => Object.keys(proposal.account.status)[0].toLowerCase();

export const getOwnProcessedProposals = (proposals: any[]) => {
    let processedProposals: OwnProposals = {} as OwnProposals;
    const inactiveProposals: Proposal[] = [];
    const activeProposals: Proposal[] = [];
    const completedProposals: Proposal[] = [];
    const failedProposals: Proposal[] = [];

    for (let i = 0; i < proposals.length; i++) {
        const p: Proposal = getProcessedProposal(proposals[i]);

        switch (p.status) {
            case "inactive":
                inactiveProposals.push(p);
                break;
            case "active":
                activeProposals.push(p);
                break;
            case "completed":
                completedProposals.push(p);
                break;
            case "failed":
                failedProposals.push(p);
                break;

            default:
                break;
        }
    }
    processedProposals = {
        inactive: inactiveProposals,
        active: activeProposals,
        completed: completedProposals,
        failed: failedProposals,
    }
    
    return processedProposals;
}

export const getProcessedProposals = async(proposals: any[], wallet?: AnchorWallet, program?: any) => {
    let res: Proposal[] = [];

    for (let i = 0; i < proposals.length; i++) {
        let p = proposals[i];
        p = getProcessedProposal(p);
        if (wallet && program) {
            const [voteAddr,] = wallet ? PublicKey.findProgramAddressSync([Buffer.from("vote"), wallet.publicKey.toBytes(), p.pubkey.toBytes()], ProgramId) : [];
            try {
                const voteAcc = voteAddr && await program?.account.userVote.fetch(voteAddr);
                if (voteAcc) {
                    p = {...p, voted: true}
                }
            } catch {
            }
        }
        res = [...res, p];

    }
    return res;
}

export const getProcessedProposalsForVote = async (proposals: any[], userKey: PublicKey, program: any) => {
    let res: ProposalForVote[] = [];

    for (let i = 0; i < proposals.length; i++) {
        const p = proposals[i];
        const [voteAddr,] = PublicKey.findProgramAddressSync([
            Buffer.from("vote"), 
            userKey.toBytes(),
            p.pubkey.toBytes(),
        ], ProgramId)
        const voteAcc =  await program?.account.userVote.fetch(voteAddr);
        
        res = [...res, {...getProcessedProposal(p), }];
    }
    return res;
}

export const getProcessedProposal = (proposal: any) => ({
    id: proposal.account.id.toNumber(),
    pubkey: proposal.publicKey,
    title: proposal.account.title,
    desc: proposal.account.desc,
    created_at: (new Date(proposal.account.createdAt.toNumber() * 1000)).toLocaleDateString(),
    max_expiry: (new Date(proposal.account.maxExpiry.toNumber() * 1000)).toLocaleDateString(),
    min_quorum: proposal.account.minQuorum.toNumber(),
    creator: proposal.account.creator,
    status: getProposalStatus(proposal),
    quorum: proposal.account.quorum.toNumber(),
})