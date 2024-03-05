"use client"
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export type SnackPropsType = {
    open: boolean,
    closeSnack: () => void,
    severity: "success" | "warning" | "info" | "error",
    content: string,
}

const CustomSnackBar = (props: SnackPropsType) => {
    const {open, closeSnack, severity, content} = props;
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={ closeSnack }>
            <Alert onClose={ closeSnack } severity={severity}>
                {content}
            </Alert>
        </Snackbar>
    );
}

export default CustomSnackBar;