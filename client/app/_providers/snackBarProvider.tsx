"use client"

import React, {
    createContext,
    useContext,
    useState
} from "react";

import CustomSnackBar, { SnackPropsType } from "../_components/customSnackBar";

type CallSnackBarType = (severity: string, content: string) => void

type SnackBarContextType = {
  callSnackBar: CallSnackBarType
}

const SnackBarContext = createContext<SnackBarContextType>({} as SnackBarContextType);

const SnackBarProvder = ({ children }: { children: React.ReactNode }) => {
    const [snackBar, setSnackBar] = useState<SnackPropsType>({} as SnackPropsType);
    
    const closeSnack = () => {
        setSnackBar(state => ({...state, open: false}));
    }

    const callSnackBar = (severity: string, content: string) => {
        setSnackBar({
            open: true,
            severity,
            content,
            closeSnack,
        } as SnackPropsType)
    }
    
    return (
        <SnackBarContext.Provider value={{callSnackBar}}>
            {children}
            <CustomSnackBar {...snackBar}/>
        </SnackBarContext.Provider>
    )
}

export default SnackBarProvder;

export function useSnackBarContext() {
  return useContext(SnackBarContext);
}