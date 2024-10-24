import React, { useEffect } from 'react';
// import Button from '@mui/material/Button';
import Snackbar, {  SnackbarOrigin } from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';

interface SnackbarProps {
    _message: string
}

interface State extends SnackbarOrigin {
    open: boolean;
}

export default function CustomizedSnackbars({_message }: SnackbarProps) {
    // const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState<State>({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;

    useEffect(() => {
        handleClick
        console.log("i am in snack");
    }, [])

    const handleClick = (newState: SnackbarOrigin) => () => {
        setState({ ...newState, open: true });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    return (
        <div>
            {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                message={_message}
                key={vertical + horizontal} />
                {/* <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                </Alert> */}
                {/* <>
                    {_message}
                </> */}
            {/* </Snackbar> */}
        </div>
    );
}
