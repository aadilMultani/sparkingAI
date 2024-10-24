// swalConfig.js

export interface swalProps {
    title: string,
    text: string,
    icon: string,
    confirmButtonText: string,
    cancelButtonText: string
}

const swalConfig = ({ title, text, icon, confirmButtonText, cancelButtonText }: swalProps) => {
    return {
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor: '#7F25FB',
        cancelButtonColor: 'rgb(24 35 68)',
        background: '#081028',
        color: '#AEB9E1'
    };
};

export default swalConfig;