import Dialog from '@mui/material/Dialog';

export interface SimpleDialogProps {
    open: boolean;
    Component: React.ReactNode;
}

const CommonModal = (props: SimpleDialogProps) => {
    const { open, Component } = props;

    return (
        <Dialog open={open} maxWidth="md">
            {Component}
        </Dialog>
    );
}

export default CommonModal;