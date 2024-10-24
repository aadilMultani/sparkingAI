// import * as React from 'react';
// import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import IconifyIcon from 'components/base/IconifyIcon';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getApi, postApi } from 'service/GlobleApi';
import { swalPopup } from 'service/GlobleService';
import UserModal from './userModal';
import CommonModal from 'components/modal/Modal';
import { useSelector } from 'react-redux';

const UsersTable = ({ clientData, setClientData, searchText }: any) => {
    const [open, setOpen] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const { countries, states, cities } = useSelector((state: any) => state.dropdownReducer);

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('userLoginDetail') || '');
        const obj = {
            searchText,
            user_id: userDetails._id,
        }
        if (searchText) {
            postApi('search-user', obj).then((res: any) => {
                console.log("res >>", res);
                setClientData(res);
            });
        }
    }, [searchText]);

    const handleModel = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = (id: GridRowId) => () => {
        getApi(`get-singleUser/${id}`).then((res: any) => {
            if (res.status) {
                setData(res.user[0]); // set data to state
                handleModel();
            }
        })
    };

    const handleDelete = (id: GridRowId) => () => {
        const title = 'Are you sure ?';
        const text = 'You want to delete this client !';
        const icon = 'warning';
        const confirmButtonText = 'Yes';
        const cancelButtonText = 'No';

        swalPopup(title, text, icon, confirmButtonText, cancelButtonText).then((res: any) => {
            if (res.isConfirmed) {
                getApi(`delete-user/${id}`).then((res: any) => {
                    if (res.status) {
                        const updatedClientData = clientData.filter((client: any) => client._id !== id);
                        setClientData(updatedClientData);
                        toast.success(res.message);
                    } else {
                        toast.error(res.message);
                    }
                }).catch((err: any) => {
                    toast.error(err.message);
                });
            }
        });
    }

    const columns: GridColDef<any>[] = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 160 },
        { field: 'phoneNo', headerName: 'Phone Number', width: 160 },
        {
            field: 'address_info',
            headerName: 'Address',
            width: 160,
            valueGetter: (params: any) => {
                const countryName = countries && countries.length ? countries.filter((country: any) => country._id === params?.country) : [];
                const stateName = states && states.length ? states.filter((state: any) => state._id === params?.state) : [];
                const cityName = cities && cities.length ? cities.filter((city: any) => city._id === params?.city) : [];

                return `
                ${params?.address_1} ${params?.address_2},${cityName[0]?.name},${stateName[0]?.name} - ${countryName[0]?.name}` ?? '';
            },
        },
        {
            field: 'rating',
            headerName: 'Rating',
            type: 'number',
            width: 110,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Action',
            minWidth: 120,
            flex: 1,
            cellClassName: 'actions',
            resizable: false,
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={
                            <IconifyIcon
                                icon="fluent:edit-32-filled"
                                color="text.secondary"
                                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
                            />
                        }
                        onClick={handleEdit(id)}
                        label="Edit"
                        size="small"
                    />,
                    <GridActionsCellItem
                        icon={
                            <IconifyIcon
                                icon="mingcute:delete-3-fill"
                                color="text.secondary"
                                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
                            />
                        }
                        onClick={handleDelete(id)}
                        label="Delete"
                        size="small"
                    />,
                ];
            },
        },
    ];

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <DataGrid
                    columns={columns}
                    rows={clientData ? clientData : []}
                    getRowId={(row) => row?._id}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    // pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                />

                {open && <CommonModal
                    open={open}
                    Component={<UserModal
                        onClose={handleClose}
                        heading='Edit User'
                        editData={data}
                        clientData={clientData}
                        setClientData={setClientData}
                    />}
                />}
            </Box>
        </>
    );
}

export default UsersTable;