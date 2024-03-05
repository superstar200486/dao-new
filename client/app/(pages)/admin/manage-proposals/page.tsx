"use client"
import { useEffect, useState } from "react"
import { PublicKey } from "@solana/web3.js"
import { redirect } from "next/navigation"
import { useAnchorWallet } from "@solana/wallet-adapter-react"

import { useProgramContext } from "@/app/_providers/programContextProvider"
import { useConfigContext } from "@/app/_providers/configProvider"
import { Proposal } from "@/app/_types"
import { approveProposal } from "@/app/_web3/proposal"
import { useSnackBarContext } from "@/app/_providers/snackBarProvider"
import { getProcessedProposals } from "@/app/_utils"

const ManageProposals =  () => {
    const [pendingProposals, setPendingProposals] = useState<Proposal[]>();
    const program = useProgramContext();
    const wallet = useAnchorWallet();
    const config = useConfigContext()?.config;
    const snackBar = useSnackBarContext();

    useEffect(() => {
        if (config?.admin) {
            fetchProposals();
        } else {
            redirect("/");
        }
    }, [config]);
    
    const fetchProposals = async () => {
        const proposals = await program?.account.proposal.all([{
            memcmp: {
                offset: 40,
                bytes: "1",
            },
        }]);
        let processedProposals: Proposal[] = proposals ? await getProcessedProposals(proposals): []
        setPendingProposals(processedProposals);
    };

    const approveProposal_v1 = async (id: number, creator: PublicKey, address: PublicKey) => {
        let res = wallet && program && await approveProposal(id, creator, address, program, wallet);
        if (res) {
            setPendingProposals(prev => prev?.filter(p => p.id !== id));
            snackBar.callSnackBar("success", "approved successfully!");
        } else {
            snackBar.callSnackBar("error", "there is an error. please check your connection.");
        }
    }

    const renderProposals = () => {
        return <>
            {
                pendingProposals ? pendingProposals.map((proposal, i) => (
                    <div key={i} className="border-2 p-2 shadow-xl">
                        <h3 className="text-center text-2xl border-b-2 pb-2">{proposal.title}</h3>
                        <div className="text-xl border-b-2 p-2">{proposal.desc}</div>
                        <div className="flex border-b-2 p-2">
                            <div className="w-full">
                                created: {proposal.created_at}
                            </div>
                            <div className="w-full">
                                expiry: {proposal.max_expiry}
                            </div>
                            <div className="w-full">
                                min quorum: {proposal.min_quorum}
                            </div>
                        </div>
                        <div>
                            <span className="inline-block p-2">
                                creator: {proposal.creator.toString()}
                            </span>
                            <button 
                                className="float-right px-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white m-2"
                                onClick={ () => approveProposal_v1(proposal.id, proposal.creator, proposal.pubkey)}>
                                approve
                            </button>
                        </div>
                    </div>
                )) : null
            }
        </>
    }

    return (
        <div>
            <div className="pt-16 min-h-screen p-12 flex flex-col gap-4">
                <h1 className="text-center text-3xl font-bold text-grey-600">pending proposals</h1>
                { renderProposals() }
            </div>
        </div>
    );
}

export default ManageProposals;