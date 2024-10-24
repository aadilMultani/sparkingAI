import Swal, { SweetAlertIcon } from 'sweetalert2';
import { getApi } from './GlobleApi';

export interface swalProps {
    title: string,
    text: string,
    icon: SweetAlertIcon,
    confirmButtonText: string,
    cancelButtonText: string
}

export interface swalResposneProps {
    isConfirmed: boolean,
    isDenied: boolean,
    isDismissed: boolean,
    value: boolean
}

function swalPopup(title: string, text: string, icon: SweetAlertIcon, confirmButtonText: string, cancelButtonText: string) {
    return Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        confirmButtonColor: '#7F25FB',
        cancelButtonColor: 'rgb(24 35 68)',
        cancelButtonText,
        background: '#081028',
        color: '#AEB9E1'
    })
}

// get all Country 
const getDataFromApi = async (uri: string) => {
    const allCountry = await getApi(uri);
    return allCountry.data;
}

// get Login User gata
const userDetails = JSON.parse(localStorage.getItem('userLoginDetail') || '');

export { swalPopup, getDataFromApi, userDetails };