"use client"
import { Modal } from "@mui/material";
import { register } from "module";
import { SubmitHandler, useForm } from "react-hook-form";
import { useConfigContext } from "@/app/_providers/configProvider";
import { createProposal } from "@/app/_web3/proposal";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useProgramContext } from "@/app/_providers/programContextProvider";
import { useSnackBarContext } from "@/app/_providers/snackBarProvider";
import "./proposalModal.css";

export interface ProposalFormData {
    title: string;
    desc: string,
    expiry_days: number,
    min_quorum: number
}

const ProposalModal = ({open, setClose, refresh}: {open: boolean, setClose: () => void, refresh: () => void}) => {
    const wallet = useAnchorWallet();
    const program = useProgramContext();
    const config = useConfigContext()?.config;
    const snackBar = useSnackBarContext();
    
    const expiryPattern = new RegExp(`^[0-${(config ? config?.max_expiry : 100) - 1}]$`);
    const { register, handleSubmit, formState: { errors } } = useForm<ProposalFormData>();

    const minQuorumValidate = (value: number, targetNumber: number | undefined) => {
        return targetNumber ? value > targetNumber : false;
    }
    
    const submit: SubmitHandler<ProposalFormData> = async (data) => {
        const res = program && wallet && await createProposal(data, program, wallet);
        if (res) {
            snackBar.callSnackBar("success", "created successfully");
            refresh();
        } else {
            snackBar.callSnackBar("error", "cannot create proposal");
        }
    }

    return (
        <Modal
            open={open}
            onClose={() => setClose()}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
                <form className="form" onSubmit={handleSubmit(submit)}>
                    <h1 className="text-center text-3xl mb-4 text-gray-800 bold uppercase">create proposal</h1>
                    <input 
                        className="title-field" 
                        type="text" 
                        {...register("title", {required: true, pattern: /^.{0,20}$/})} 
                        placeholder="propsoal title"/>
                    {errors.title ? <p className="error">incorrect title(min: 1, max: 20)</p> : null}
                    <input 
                        className="desc-field" 
                        type="textarea"
                        {...register("desc", {required: true, pattern: /^.{0,50}$/})} 
                        placeholder="propsoal description"/>
                    {errors.desc ? <p className="error">incorrect description(min: 1, max: 50)</p> : null}
                    <div className="flex gap-4">
                        <div className="w-full">
                            <input 
                                className="number-field" 
                                type="number" 
                                {...register("expiry_days", {required: true, pattern: expiryPattern})}  
                                placeholder="propsoal expiry days"/>
                            {errors.expiry_days ? <p className="error">incorrect expiry days(max: {config?.max_expiry})</p> : null}
                        </div>
                        <div className="w-full">
                            <input 
                                className="number-field" 
                                type="number" 
                                {...register("min_quorum", {required: true, validate: val => minQuorumValidate(val, config?.min_quorum)})  }
                                placeholder="propsoal minimum quorum"/>
                            {errors.min_quorum ? <p className="error">incorrect min quorum(min: {config?.min_quorum})</p> : null}
                        </div>
                    
                    </div>
                    <button className="submit" type="submit">CREATE</button>
                </form>           
        </Modal>
    )
}

export default ProposalModal;