import DialogTitle from '@mui/material/DialogTitle';
import { Button, DialogActions, DialogContent, DialogContentText, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { getApi, postApi } from 'service/GlobleApi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { userDetails } from 'service/GlobleService';

interface ClientModelProps {
    onClose: () => void;
    heading: string;
    jobsdata?: any;
    setJobsdata?: any;
    editData?: any;
}

const JobsModal = (props: ClientModelProps) => {
    const { onClose, jobsdata, setJobsdata, editData, heading } = props;
    // const [options, setOptions] = useState([]);
    const [country, setCountries] = useState([]);
    const [state, setStates] = useState([]);
    const [citys, setCities] = useState([]);
    // const [open, setOpen] = useState(false);

    const formatDate = (isoDate:string) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formFields, setFormFields] = useState<any>({
        user_id: userDetails._id,
        category: editData ? editData?.category : "",
        job_type: editData ? editData?.job_type : "",
        status: editData ? editData?.status : "",
        priority: editData ? editData?.priority : "",
        costing: editData ? editData?.costing : 0,
        schedule: editData ? formatDate(editData?.schedule) : "",
        notes: editData ? editData?.notes : "",
        description: editData ? editData?.description : "",
        location: {
            address_1: editData ? editData?.location?.address_1 : "",
            address_2: editData ? editData?.location?.address_2 : "",
            city: editData ? editData?.location?.city : "",
            state: editData ? editData?.location?.state : "",
            country: editData ? editData?.location?.country : "",
        },
    });
    const { countries, states, cities } = useSelector((state: any) => state.dropdownReducer);

    // const handleDropdownOpen = () => {
    //     if (!options.length) {
    //         getApi('get-role')
    //             .then(response => {
    //                 setOptions(response.data);
    //             })
    //             .catch(error => {
    //                 console.error(error);
    //             });
    //     }
    //     setOpen(true);
    // };

    // const handleDropdownClose = () => {
    //     setOpen(false);
    // }

    const handleClose = () => {
        onClose();
        setFormFields({
            category: "",
            job_type: "",
            status: "",
            priority: "",
            description: "",
            costing: 0,
            notes: "",
            schedule: "",
            location: {
                address_1: "",
                address_2: "",
                city: "",
                state: "",
                country: "",
            },
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (editData) {
            postApi(`update-jobCart/${editData._id}`, formFields).then((res: any) => {
                if (res.status) {
                    // Find the index of the job cart in the jobsdata array
                    const index = jobsdata.findIndex((client: any) => client._id === editData._id);
                    // Update the client user in the jobsdata array
                    if (index !== -1) {
                        const updatedClientData = [...jobsdata];
                        updatedClientData[index] = res.data;
                        setJobsdata(updatedClientData);
                        toast.success(res.message);
                        handleClose();
                    }
                }
            })
        } else {
            postApi('add-jobCart', formFields).then((res: any) => {
                if (res.status) {
                    const newClientData = [res.data, ...jobsdata];
                    setJobsdata(newClientData);
                    toast.success(res.message);
                    handleClose();
                } else {
                    toast.error(res.message);
                }
            });
        }
    }

    const handleChangeInput = (e: any) => {
        if (e.target.name.includes('.')) {
            const [key, subKey] = e.target.name.split('.');
            setFormFields({ ...formFields, [key]: { ...formFields[key], [subKey]: e.target.value } });
        } else {
            setFormFields({ ...formFields, [e.target.name]: e.target.value });
        }
    }

    // Add this function to reset state and city dropdowns
    const handleCountryChange = (e: any) => {
        setFormFields({
            ...formFields,
            location: {
                ...formFields.location,
                state: '',
                city: '',
                country: e.target.value
            }
        });
        setStates([]); // Reset states
        setCities([]); // Reset cities
    }

    return (
        <>
            <Stack justifyContent={"space-between"}>
                <DialogTitle>{heading}</DialogTitle>
                <CloseIcon onClick={handleClose} />
            </Stack>

            <DialogContent>
                <DialogContentText>
                    Jobs Detail
                </DialogContentText>
                <Divider />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="category">Category</InputLabel>
                            <Select
                                id="category"
                                name="category"
                                label="Category"
                                value={formFields.category || ''}
                                defaultValue=""
                                placeholder='Category'
                                onChange={handleChangeInput}
                                renderValue={(value) => {
                                    return value;
                                }}
                            >
                                <MenuItem value={''}>Select Category</MenuItem>
                                <MenuItem value={'Drain Cleaning'}>Drain Cleaning</MenuItem>
                                <MenuItem value={'Pipe Repair'}>Pipe Repair</MenuItem>
                                <MenuItem value={'Water Heater Installation'}>Water Heater Installation</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="job_type">Job Type</InputLabel>
                            <Select
                                id="job_type"
                                name="job_type"
                                label="Job Type"
                                value={formFields.job_type || ''}
                                defaultValue=""
                                onChange={handleChangeInput}
                                renderValue={(value) => {
                                    return value;
                                }}
                            >
                                <MenuItem value={''}>Select Job Type</MenuItem>
                                <MenuItem value={'Residential'}>Residential</MenuItem>
                                <MenuItem value={'Commercial'}>Commercial</MenuItem>
                                <MenuItem value={'Emergency'}>Emergency</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="status">Status</InputLabel>
                            <Select
                                id="status"
                                name="status"
                                label="Status"
                                value={formFields.status || ''}
                                defaultValue=""
                                onChange={handleChangeInput}
                                renderValue={(value) => {
                                    return value;
                                }}
                            >
                                <MenuItem value={''}>Select Status</MenuItem>
                                <MenuItem value={'New'}>New</MenuItem>
                                <MenuItem value={'In Progress'}>In Progress</MenuItem>
                                <MenuItem value={'Completed'}>Completed</MenuItem>
                                <MenuItem value={'Cancelled'}>Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="priority">Priority</InputLabel>
                            <Select
                                id="priority"
                                name="priority"
                                label="priority"
                                value={formFields.priority || ''}
                                defaultValue=""
                                onChange={handleChangeInput}
                                renderValue={(value) => value}
                            >
                                <MenuItem value={''}>Select Priority</MenuItem>
                                <MenuItem value={'Low'}>Low</MenuItem>
                                <MenuItem value={'Medium'}>Medium</MenuItem>
                                <MenuItem value={'High'}>High</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* <Grid item xs={12} sm={6} md={3} lg={3}>
                        <FormControl sx={{ width: '100%' }}>
                            <FormLabel>Role</FormLabel>
                            <Select
                                id="role"
                                name="role"
                                value={formFields.role || ''}
                                defaultValue=""
                                onChange={handleChangeInput}
                                onOpen={handleDropdownOpen}
                                onClose={handleDropdownClose}
                                open={open}
                                renderValue={(value) => {
                                    const roleName = roles && roles.length ? roles.filter((role: any) => role._id === value) : [];
                                    return roleName[0].name
                                }}
                            >
                                {options.map((option: any, index: any) => (
                                    <MenuItem key={index} value={option._id}>{option.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid> */}

                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <FormControl fullWidth>
                            <OutlinedInput
                                id="costing"
                                name="costing"
                                value={formFields.costing || ''}
                                type='number'
                                placeholder='Costing'
                                onChange={handleChangeInput}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <FormControl fullWidth>
                            <OutlinedInput
                                id="schedule"
                                name="schedule"
                                value={formFields.schedule || ''}
                                type='date'
                                placeholder='Schedule'
                                onChange={handleChangeInput}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <FormControl fullWidth>
                            <TextField
                                id="description"
                                name='description'
                                label="Description"
                                multiline
                                rows={2}
                                value={formFields.description || ''}
                                onChange={handleChangeInput}
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <DialogContentText pt={2} pb={2}>
                    Address Information
                </DialogContentText>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <TextField
                            id="address_1"
                            name="location.address_1"
                            type="text"
                            value={formFields.location.address_1}
                            onChange={handleChangeInput}
                            variant="filled"
                            placeholder="Address 1"
                            autoComplete="address_1"
                            sx={{ width: '100%' }}
                            autoFocus
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <TextField
                            id="address_2"
                            name="location.address_2"
                            type='text'
                            value={formFields.location.address_2}
                            onChange={handleChangeInput}
                            variant="filled"
                            placeholder="Address 2"
                            autoComplete="address_2"
                            sx={{ width: '100%' }}
                            autoFocus
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="country">Country</InputLabel>
                            <Select
                                labelId="country"
                                id="country"
                                name="location.country"
                                label="Country"
                                value={formFields.location.country || ''}
                                defaultValue=""
                                onChange={handleCountryChange}
                                onOpen={() => {
                                    getApi('get-country').then(response => setCountries(response.data))
                                }}
                                renderValue={(value) => {
                                    const countryName = countries && countries.length ? countries.filter((country: any) => country._id === value) : []
                                    return countryName[0].name;
                                }}
                            >
                                {country.map((country: any, index: any) => (
                                    <MenuItem key={index} value={country._id}>{country.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="state">State</InputLabel>
                            <Select
                                labelId="state"
                                id="state"
                                name="location.state"
                                label="State"
                                value={formFields.location.state || ''}
                                defaultValue=""
                                onChange={handleChangeInput}
                                onOpen={() => {
                                    if (formFields.location.country) {
                                        getApi(`get-state/${formFields.location.country}`).then(res => setStates(res.data))
                                    }
                                }}
                                renderValue={(value) => {
                                    const stateName = states && states.length ? states.filter((state: any) => state._id === value) : [];
                                    return stateName[0].name;
                                }}
                            >
                                {state.map((state: any, index: any) => (
                                    <MenuItem key={index} value={state._id}>{state.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="city">City</InputLabel>
                            <Select
                                labelId="city"
                                id="city"
                                name="location.city"
                                label="City"
                                value={formFields.location.city || ''}
                                defaultValue=""
                                onChange={handleChangeInput}
                                onOpen={() => {
                                    if (formFields.location.state) {
                                        getApi(`get-cities/${formFields.location.state}`).then(res => setCities(res.data))
                                    }
                                }}
                                renderValue={(value) => {
                                    const cityName = cities && cities.length ? cities.filter((city: any) => city._id === value) : [];
                                    return cityName[0].name;
                                }}
                            >
                                {citys.map((city: any, index: any) => (
                                    <MenuItem key={index} value={city._id}>{city.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>
            </DialogContent>

            <form onSubmit={handleSubmit}>
                <DialogActions>
                    <Stack gap={2}>
                        <Button onClick={handleClose} variant="contained" size="small" color='secondary'>
                            Cancel
                        </Button>
                        <Button type='submit' variant="contained" size="small">
                            Submit
                        </Button>
                    </Stack>
                </DialogActions>
            </form>
        </>
    )
}

export default JobsModal;