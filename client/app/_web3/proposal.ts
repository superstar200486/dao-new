import * as anchor from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ProgramId } from "@/app/_constants";
import { ProposalFormData } from "../_components/proposalModal";

export const approveProposal = async (
    id: number,
    creator: PublicKey,
    address: PublicKey,
    program: any, 
    signer: AnchorWallet
) => {
    const [config,] = PublicKey.findProgramAddressSync([Buffer.from("config")], ProgramId);
    try {
        const tx = await program.methods
        .approveProposal(new anchor.BN(id), creator)
        .accounts({
            signer: signer.publicKey,
            proposal: address,
            config: config,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
        return tx ?  true: false; 
    } catch (e) {
        return false;
    }
}

export const createProposal = async (data: ProposalFormData, program: any, signer: AnchorWallet) => {
    const { title, desc, expiry_days, min_quorum } = data;

    const [userAccount,] = PublicKey.findProgramAddressSync([Buffer.from("user"), signer.publicKey.toBytes()], ProgramId);
    const [config,] = PublicKey.findProgramAddressSync([Buffer.from("config")], ProgramId);
    const [treasury, ] = PublicKey.findProgramAddressSync([Buffer.from("treasury"), config.toBytes()], ProgramId);

    const configAccount = await program.account.config.fetch(config);
    const proposalCount = configAccount.proposalCount.toNumber();
    const countSeed = proposalCount ? proposalCount + 1 : 1;

    const [proposal] = PublicKey.findProgramAddressSync(
        [Buffer.from("proposal"), signer.publicKey.toBytes(), Buffer.from(new anchor.BN(countSeed).toArray("le", 8))],
        ProgramId
    );

    try {
        const tx = await program.methods
        .createProposal(title, desc, new anchor.BN(expiry_days), new anchor.BN(min_quorum))
        .accounts({
            creator: signer.publicKey,
            userAccount,
            proposal,
            treasury,
            config,
            systemProgram: anchor.web3.SystemProgram.programId,
        }
        )
        .signers([])
        .rpc();
        return tx ?  true: false; 
    } catch (e) {
        return false;
    }
}

export const failProposal = async (
    id: number,
    creator: PublicKey,
    address: PublicKey,
    program: any, 
    signer: AnchorWallet
) => {
    const [userAccount,] = PublicKey.findProgramAddressSync([Buffer.from("user"), signer.publicKey.toBytes()], ProgramId);
    try {
        const tx = await program.methods
        .closeProposal(new anchor.BN(id), creator)
        .accounts({
            signer: signer.publicKey,
            proposal: address,
            userAccount: userAccount,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
        
        return tx ?  true: false; 
    } catch (e) {
        return false;
    }
}

export const completeProposal = async (
    id: number,
    creator: PublicKey,
    address: PublicKey,
    program: any, 
    signer: AnchorWallet
) => {
    const [userAccount,] = PublicKey.findProgramAddressSync([Buffer.from("user"), signer.publicKey.toBytes()], ProgramId);
    try {
        const tx = await program.methods
        .completeProposal(new anchor.BN(id), creator)
        .accounts({
            signer: signer.publicKey,
            proposal: address,
            userAccount: userAccount,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
        
        return tx ?  true: false; 
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const voting = async (
    id: number,
    creator: PublicKey,
    address: PublicKey,
    program: any, 
    signer: AnchorWallet
) => {
    const [userAccount,] = PublicKey.findProgramAddressSync([Buffer.from("user"), signer.publicKey.toBytes()], ProgramId);
    const [vote,] = PublicKey.findProgramAddressSync([Buffer.from("vote"), signer.publicKey.toBytes(), address.toBytes()], ProgramId);
    try {
        const tx = await program.methods
        .vote(new anchor.BN(id), creator)
        .accounts({
            signer: signer.publicKey,
            proposal: address,
            vote: vote,
            userAccount: userAccount,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
        
        return tx ?  true: false; 
    } catch (e) {
        return false;
    }
}