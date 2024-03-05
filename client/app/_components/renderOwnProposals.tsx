"use client"
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useProgramContext } from "../_providers/programContextProvider";
import { useSnackBarContext } from "../_providers/snackBarProvider";
import { OwnProposals, Proposal } from "../_types";
import { completeProposal, failProposal } from "../_web3/proposal";
import { useConfigContext } from "../_providers/configProvider";

const RenderProposals = ({ownProposals, refresh} : {ownProposals: OwnProposals, refresh: () => void}) => {
    const snackBar = useSnackBarContext();
    const program = useProgramContext();
    const wallet = useAnchorWallet();
    const config = useConfigContext()?.config;

    const completingProposal = async (p: Proposal) => {
        if (p.quorum < p.min_quorum) {
            return snackBar.callSnackBar("error", "not enough quorum!");
        }

        const res = program && wallet && await completeProposal(p.id, p.creator, p.pubkey, program, wallet);

        if (res) {
            await refresh();
            snackBar.callSnackBar("success", "successfully completed!");
        } else {
            snackBar.callSnackBar("error", "Oops! there is an error!");
        }
    }

    const closeProposal = async (p: Proposal) => {
        const res = program && wallet && await failProposal(p.id, p.creator, p.pubkey, program, wallet);

        if (res) {
            await refresh();
            snackBar.callSnackBar("success", "successfully closed!");
        } else {
            snackBar.callSnackBar("error", "Oops! there is an error!");
        }
    }

    return (
        Object.entries(ownProposals).map(([key, proposals]) => (
            <div key={key} className="border-2 p-3 border-grey-600 text-center  mb-2 shadow-2xl">
                <h3 className="text-2xl font-bold uppercase mb-3">{key} proposals list</h3>
                {
                    proposals.map((p: Proposal, k: number) => (
                    <div className="flex flex-col border-2 mb-2" key={k}>
                        <h3 className="text-center text-2xl border-b-2 p-2">{p.title}</h3>
                        <div className="text-xl p-2 text-left">{p.desc}</div>
                        <div className="flex p-2">
                            <div className="w-full">
                                created: {p.created_at}
                            </div>
                            <div className="w-full">
                                expiry: {p.max_expiry}
                            </div>
                            <div className="w-full">
                                min quorum: {p.min_quorum}
                            </div>
                            {
                                p.status !== "inactive" ? (
                                    <div className="w-full">
                                        now quorum: {p.quorum}
                                    </div>
                                ) : null
                            }
                            
                        </div>
                        {
                            config?.user?.status === "active" ? (
                                <div>
                                    { key === "active" ? (
                                        <>
                                        <button 
                                            className="float-right px-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white m-2"
                                            onClick={ () => completingProposal(p) }>
                                            complete
                                        </button>
                                    </>
                                    ) : null }
                                    { key === "inactive" || key === "active" ? (
                                        <>
                                        <button 
                                            className="float-right px-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white m-2"
                                            onClick={ () => closeProposal(p) }>
                                            close
                                        </button>
                                    </>
                                    ) : null }
                                </div>
                            ) : null
                        }
                    </div>
                    ))
                }
                </div>
            
        ))
    );
}  
export default RenderProposals;