"use client"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { useAnchorWallet } from "@solana/wallet-adapter-react"

import { useProgramContext } from "@/app/_providers/programContextProvider"
import { useConfigContext } from "@/app/_providers/configProvider"
import { OwnProposals } from "@/app/_types"
import { getOwnProcessedProposals } from "@/app/_utils"
import ProposalModal from "@/app/_components/proposalModal"
import RenderProposals from "@/app/_components/renderOwnProposals"

const OwnProposals =  () => {
    const [open, setOpen] = useState(false);
    const [ownProposals, setOwnProposals] = useState<OwnProposals>({} as OwnProposals);

    const program = useProgramContext();
    const wallet = useAnchorWallet();
    const config = useConfigContext()?.config;

    useEffect(() => {
        if (config?.user?.status === "active") {
            fetchProposals();
            
        } else {
            redirect("/");
        }
    }, [config]);

    const fetchProposals = async () => {
        const proposals = wallet ? await program?.account.proposal.all([{
            memcmp: {
             offset: 8,
             bytes: wallet.publicKey.toBase58(),
            },
           }]) : [];
        proposals && wallet && setOwnProposals(getOwnProcessedProposals(proposals))
    };

    return (
        <div className="pt-16 min-h-screen ">
            <div>
                <button 
                    className="float-right px-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white m-2"
                    onClick={ () => setOpen(true) }>
                    create proposal
                </button>
            </div>
            <div className="p-12">
                <RenderProposals ownProposals={ownProposals} refresh={ () => fetchProposals() }/>
            </div>
            <ProposalModal open={open} setClose={ () => { setOpen(false) }} refresh={ () => fetchProposals() }/>
        </div>
    );
}

export default OwnProposals;