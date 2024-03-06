"use client"
import { useEffect } from "react";
import { redirect } from "next/navigation";

import { useConfigContext } from "@/app/_providers/configProvider";
import { useProgramContext } from "@/app/_providers/programContextProvider";
import { useSnackBarContext } from "@/app/_providers/snackBarProvider";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { SubmitHandler, useForm } from "react-hook-form"
import { initDao } from "@/app/_web3/initDao";
import "./initPageStyle.css";

export interface InitFormData {
    issuePrice: number,
    issueAmount: number,
    proposalFee: number,
    maxSupply: number,
    minQuorum: number,
    maxExpiry: number
}

const InitDao = () => {
    const wallet = useAnchorWallet();
    const program = useProgramContext();
    const config = useConfigContext();
    const snackBar = useSnackBarContext();

    useEffect(() => {
        if (!(wallet && config?.config === undefined)) {
            redirect("/");
        }
    }, [config])

    const { register, handleSubmit, formState: { errors } } = useForm<InitFormData>();

    const submit: SubmitHandler<InitFormData> = async (data) => {
        const res = program && wallet && await initDao(data, program, wallet);
        if (res) {
            snackBar.callSnackBar("success", "successfully initialized!");
            const { 
                issuePrice, 
                issueAmount, 
                proposalFee, 
                minQuorum, 
                maxExpiry 
            } = data;
            config?.setConfig({
                issue_price: issuePrice,
                issue_amount: issueAmount,
                proposal_fee: proposalFee,
                min_quorum: minQuorum,
                max_expiry: maxExpiry,
                proposal_count: 0,
                admin: true,
                user: undefined,
            })
        } else {
            snackBar.callSnackBar("error", "cannot initialze dao. please check your connection.");
        }
    }

    return (
        <div className="pt-16 min-h-screen flex items-center justify-center">
            <form className="p-14 shadow-2xl w-6/12 bg-white" onSubmit={handleSubmit(submit)}>
                <h1 className="text-center text-3xl mb-4 text-gray-800 bold uppercase">init dao</h1>
                <div className="flex gap-4">
                    <div className="w-full">
                        <input 
                            className="number-field" 
                            type="number" 
                            {...register("issuePrice", {required: true})}  
                            placeholder="issue price/lamports"/>
                        {errors.issuePrice ? <p className="error">incorrect issue price</p> : null}
                    </div>
                    <div className="w-full">
                        <input 
                            className="number-field" 
                            type="number" 
                            {...register("issueAmount", {required: true})  }
                            placeholder="issue amount"/>
                        {errors.issueAmount ? <p className="error">incorrect issue amount(required)</p> : null}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-full">
                        <input 
                            className="number-field" 
                            type="number" 
                            {...register("proposalFee", {required: true})}  
                            placeholder="proposal fee/lamports"/>
                        {errors.proposalFee ? <p className="error">incorrect proposal fee(required)</p> : null}
                    </div>
                    <div className="w-full">
                        <input 
                            className="number-field" 
                            type="number" 
                            {...register("maxSupply", {required: true})  }
                            placeholder="max supply amount"/>
                        {errors.maxSupply ? <p className="error">incorrect max supply(required)</p> : null}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-full">
                        <input 
                            className="number-field" 
                            type="number" 
                            {...register("minQuorum", {required: true})}  
                            placeholder="min quorum"/>
                        {errors.minQuorum ? <p className="error">incorrect min muorum(required)</p> : null}
                    </div>
                    <div className="w-full">
                        <input 
                            className="number-field" 
                            type="number" 
                            {...register("maxExpiry", {required: true})  }
                            placeholder="max expiry day"/>
                        {errors.maxExpiry ? <p className="error">incorrect max expiry(required)</p> : null}
                    </div>
                </div>
                <button className="submit" type="submit">INIT</button>
            </form>  
        </div>
    )
}

export default InitDao;