"use client"
import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

import { ProgramId } from "../_constants";
import idl from "../_payload/dapp.json";
import { Dapp } from "../_payload/dapp";

export const ProgramContext = createContext<anchor.Program<Dapp> | undefined>(undefined);

const ProgramProvider = ({ children }: { children: React.ReactNode }) => {
    const [program, setProgram] = useState<anchor.Program<Dapp>>();
    const { connection } = useConnection();
    let wallet = useAnchorWallet();
    
    useEffect(() => {
        let call = async () => {
            let provider: anchor.Provider;
            if (wallet && connection) {
                try {
                    provider = anchor.getProvider();
                } catch {
                    provider = new anchor.AnchorProvider(connection, wallet as anchor.Wallet, {
                        preflightCommitment: "recent",
                        commitment: "processed",
                    });
                    anchor.setProvider(provider);
                    const program = new anchor.Program<Dapp>(idl as any, ProgramId);
                    setProgram(program);
                }
            }
            else {
                
            }
        };
        call();
    }, [wallet, connection])
    
    return (
        <ProgramContext.Provider value={program}>
            {children}
        </ProgramContext.Provider>
    )
}

export default ProgramProvider;

export function useProgramContext() {
    return useContext(ProgramContext);
}