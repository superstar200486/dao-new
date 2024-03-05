"use client"
import { useEffect, useState } from "react"
import { useAnchorWallet } from "@solana/wallet-adapter-react" 
import { redirect } from "next/navigation"

import { useProgramContext } from "@/app/_providers/programContextProvider"
import { useConfigContext } from "@/app/_providers/configProvider"
import { Proposal, ProposalForVote } from "@/app/_types"
import { voting } from "@/app/_web3/proposal"
import { useSnackBarContext } from "@/app/_providers/snackBarProvider"
import { getProcessedProposals } from "@/app/_utils"

const ViewProposals =  () => {
    const [proposals, setProposals] = useState<ProposalForVote[]>([]);
    const program = useProgramContext();
    const wallet = useAnchorWallet();
    const config = useConfigContext()?.config;
    const snackBar = useSnackBarContext();

    useEffect(() => {
        if (wallet) {
            call();
        } else {
            redirect("/");
        }
    }, [config]);
    
    const call = async () => {
        const proposals = await program?.account.proposal.all([{
            memcmp: {
                offset: 40, // Discriminator.
                bytes: "2",
            },
        }]);
        
        let processedProposals: ProposalForVote[] = proposals ? await getProcessedProposals(proposals, wallet, program): [];
        setProposals(processedProposals);
    };
    
    const vote = async (proposal: Proposal) => {
        const res = program && wallet && await voting(proposal.id, proposal.creator, proposal.pubkey, program, wallet);

        if (res) {
            if (res) {
                setProposals(prev => prev.map(p => p.id === proposal.id ? {...p, voted: true, quorum: ++p.quorum} : p))
                snackBar.callSnackBar("success", "voted successfully!");
            } else {
                snackBar.callSnackBar("error", "there is an error. please check your connection.");
            }
        }
    }

    const renderVoteButton = (p: ProposalForVote) => {
        return p.creator.toString() !== wallet?.publicKey.toString() ? (p.voted ? 
        (<span className="float-right px-3 border-2 border-red-600 text-red-600 italic hover:bg-red-600 hover:text-white m-2">voted!</span>) : 
        (config?.user && config.user.status === "active" ? <button 
            className="float-right px-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white m-2"
            onClick={ () => vote(p)}>
            vote
        </button> : null)) : null;
    }

    const renderProposals = () => {
        return <>
            {
                proposals ? proposals.map((p, i) => (
                    <div key={i} className="border-2 p-2 shadow-xl">
                        <h3 className="text-center text-2xl border-b-2 pb-2">{p.title}</h3>
                        <div className="text-xl border-b-2 p-2">{p.desc}</div>
                        <div className="flex border-b-2 p-2">
                            <div className="w-full">
                                created: {p.created_at}
                            </div>
                            <div className="w-full">
                                expiry: {p.max_expiry}
                            </div>
                            <div className="w-full">
                                min quorum: {p.min_quorum}
                            </div>
                            <div className="w-full">
                                quorum: {p.quorum}
                            </div>
                        </div>
                        <div>
                            <span className="inline-block p-2">
                                creator: {p.creator.toString()}
                            </span>
                            { renderVoteButton(p) }
                        </div>
                    </div>
                )) : null
            }
        </>
    }

    return (
        <div>
            <div className="pt-24 min-h-screen p-12 ptflex flex-col gap-4">
                { renderProposals() }
            </div>
        </div>
    );
}

export default ViewProposals;