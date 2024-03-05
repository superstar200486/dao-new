"use client"
import { Modal } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useProgramContext } from "@/app/_providers/programContextProvider";
import { useSnackBarContext } from "@/app/_providers/snackBarProvider";
import { transferToken } from "@/app/_web3/manageTokens";
import "./tokenTransferModalStyle.css";

export interface TransferFormData {
    destination: string,
    amount: number,
}

const TokenTransferModal = ({open, setClose, refresh}: {open: boolean, setClose: () => void, refresh: () =>  void}) => 
{
    const wallet = useAnchorWallet();
    const program = useProgramContext();
    const snackBar = useSnackBarContext();
    const { register, handleSubmit, formState: { errors } } = useForm<TransferFormData>();
    
    const submit: SubmitHandler<TransferFormData> = async (data) => {
        const res = program && wallet && await transferToken(data, program, wallet);
        if (res) {
            await refresh();
            snackBar.callSnackBar("success", "transfered successfully");
            setClose();
        } else {
            snackBar.callSnackBar("error", "cannot transfer. please check your status.");
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
                    <h1 className="text-center text-3xl mb-4 text-gray-800 bold uppercase">transfer tokens</h1>
                    
                    <div className="w-full">
                        <input 
                            className="number-field"
                            type="text" 
                            {...register("destination", {required: true})}  
                            placeholder="receiver public key"/>
                        {errors.destination ? <p className="error">incorrect destination</p> : null}
                    </div>
                    <div className="w-full">
                        <input 
                            className="number-field" 
                            type="number" 
                            {...register("amount", {required: true, pattern: /^\d+$/})}
                            placeholder="amount"/>
                        {errors.amount ? <p className="error">incorrect amount(Enter integer)</p> : null}
                    </div>
                    
                    <button className="submit" type="submit">TRANSFER</button>
                </form>           
        </Modal>
    )
}

export default TokenTransferModal;