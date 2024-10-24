import DialogTitle from '@mui/material/DialogTitle';
import { Button, DialogActions, DialogContent, DialogContentText, Divider, FormControl, FormHelperText, FormLabel, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { getApi, postApi } from 'service/GlobleApi';
import { toast } from 'react-toastify';
import IconifyIcon from 'components/base/IconifyIcon';
import { useSelector } from 'react-redux';
import { userValidationSchema } from 'components/validation/validationData';

interface ClientModelProps {
    onClose: () => void;
    heading: string;
    clientData?: any;
    setClientData?: any;
    editData?: any;
}

const UserModal = (props: ClientModelProps) => {
    const { onClose, clientData, setClientData, editData, heading } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [options, setOptions] = useState([]);
    const [country, setCountries] = useState([]);
    const [state, setStates] = useState([]);
    const [citys, setCities] = useState([]);
    const [open, setOpen] = useState(false);
    const [formFields, setFormFields] = useState<any>({
        name: editData ? editData?.name : "",
        email: editData ? editData?.email : "",
        phoneNo: editData ? editData?.phoneNo : "",
        password: editData ? editData?.password : "",
        role: editData ? editData?.role : "",
        type: editData ? editData?.type : "",
        notes: editData ? editData?.notes : "",
        rating: editData ? editData?.rating : 0,
        address_info: {
            address_1: editData ? editData?.address_info?.address_1 : "",
            address_2: editData ? editData?.address_info?.address_2 : "",
            city: editData ? editData?.address_info?.city : "",
            state: editData ? editData?.address_info?.state : "",
            country: editData ? editData?.address_info?.country : "",
        },
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phoneNo: '',
        password: '',
        rating: '',
        role: '',
        address_info: {
            address_1: '',
            address_2: '',
            country: '',
            state: '',
            city: '',
        },
    });
    const { countries, states, cities, roles } = useSelector((state: any) => state.dropdownReducer);

    const validateForm = () => {
        try {
            userValidationSchema.validateSync(formFields, { abortEarly: false });
            return true;
        } catch (error: any) {
            const newErrors: any = {};
            error.inner.forEach((err: any) => {
                const pathParts = err.path.split('.');
                let current = newErrors;

                for (let i = 0; i < pathParts.length - 1; i++) {
                    if (!current[pathParts[i]]) {
                        current[pathParts[i]] = {};
                    }
                    current = current[pathParts[i]];
                }
                current[pathParts[pathParts.length - 1]] = err.message;
            });
            setErrors(newErrors);
            return false;
        }
    };

    const handleDropdownOpen = () => {
        if (!options.length) {
            getApi('get-role')
                .then(response => {
                    setOptions(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
        setOpen(true);
    };

    const handleDropdownClose = () => {
        setOpen(false);
    }

    const handleClose = () => {
        onClose();
        setFormFields({
            contact_information: {
                email: "",
                phone_number: 0
            },
            address_info: {
                address_1: "",
                address_2: "",
                city: "",
                state: "",
                country: ""
            },
            name: "",
            type: "",
            category: "",
            notes: "",
            rating: 0,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (validateForm()) {
            if (editData) {
                postApi(`update-user/${editData._id}`, formFields).then((res: any) => {
                    if (res.status) {
                        // Find the index of the client user in the clientData array
                        const index = clientData.findIndex((client: any) => client._id === editData._id);
                        // Update the client user in the clientData array
                        if (index !== -1) {
                            const updatedClientData = [...clientData];
                            updatedClientData[index] = res.data;
                            setClientData(updatedClientData);
                            toast.success(res.message);
                            handleClose();
                        }
                    }
                })
            } else {
                postApi('create-user', formFields).then((res: any) => {
                    if (res.status) {
                        const newClientData = [res.user, ...clientData];
                        setClientData(newClientData);
                        toast.success(res.message);
                        handleClose();
                    } else {
                        toast.error(res.message);
                    }
                });
            };
        } else {
            console.log("errors >>>", errors);
        }
    };

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
            address_info: {
                ...formFields.address_info,
                state: '',
                city: '',
                country: e.target.value
            }
        });
        setStates([]); // Reset states
        setCities([]); // Reset cities
    }

    // Select input error style 
    const errorStyle = {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            '&.Mui-error': {
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'red',
                },
            },
        },
    };

    const errorTextFieldStyle = {
        width: '100%',
        '&.Mui-error': {
            '& .MuiFilledInput-root': {
                borderColor: 'red',
            },
        },
    }

    return (
        <>
            <Stack justifyContent={"space-between"}>
                <DialogTitle>{heading}</DialogTitle>
                <CloseIcon onClick={handleClose} />
            </Stack>

            <DialogContent>
                <DialogContentText>
                    User Detail
                </DialogContentText>
                <Divider />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl sx={{ ...errorTextFieldStyle }} error={!!errors.name}
                        >
                            <FormLabel>Name</FormLabel>
                            <TextField
                                id="name"
                                name="name"
                                type="text"
                                value={formFields.name}
                                onChange={handleChangeInput}
                                placeholder="Your Name"
                                autoComplete="name"
                                autoFocus
                                required
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl sx={{ ...errorTextFieldStyle }} error={!!errors.email}
                        >
                            <FormLabel>Email</FormLabel>
                            <TextField
                                id="email"
                                name="email"
                                type="text"
                                value={formFields.email}
                                onChange={handleChangeInput}
                                placeholder="Your Email"
                                required
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl sx={{ ...errorTextFieldStyle }} error={!!errors.phoneNo}>
                            <FormLabel>Phone Number</FormLabel>
                            <TextField
                                id="phoneNo"
                                name="phoneNo"
                                type='number'
                                value={formFields.phoneNo}
                                onChange={handleChangeInput}
                                placeholder="Your Phone Number"
                                autoFocus
                                required
                                error={!!errors.phoneNo}
                                helperText={errors.phoneNo}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl sx={{ ...errorTextFieldStyle }} error={!!errors.password}
                        >
                            <FormLabel>Password</FormLabel>
                            <TextField
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formFields.password}
                                onChange={handleChangeInput}
                                placeholder="Your Password"
                                autoComplete="current-password"
                                fullWidth
                                autoFocus
                                required
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" sx={{ opacity: formFields.password ? 1 : 0 }}>
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                <IconifyIcon icon={showPassword ? 'ion:eye' : 'ion:eye-off'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl sx={{ ...errorTextFieldStyle }} error={!!errors.rating}
                        >
                            <FormLabel>Rating</FormLabel>
                            <TextField
                                id="rating"
                                name="rating"
                                type='number'
                                value={formFields.rating}
                                onChange={handleChangeInput}
                                placeholder="Rating"
                                required
                                error={!!errors.rating}
                                helperText={errors.rating}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl sx={{ ...errorStyle }} error={!!errors.role}>
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
                                <MenuItem value="">Select a Role</MenuItem>
                                {options.map((option: any, index: any) => (
                                    <MenuItem key={index} value={option._id}>{option.name}</MenuItem>
                                ))}
                            </Select>
                            {!!errors.role && <FormHelperText sx={{ color: '#FF5A65' }}>{errors.role}</FormHelperText>}
                        </FormControl>
                    </Grid>
                </Grid>

                <DialogContentText pt={2} pb={2}>
                    Address Information
                </DialogContentText>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            id="address_1"
                            name="address_info.address_1"
                            type="text"
                            value={formFields.address_info.address_1}
                            onChange={handleChangeInput}
                            variant="filled"
                            placeholder="Address 1"
                            autoComplete="address_1"
                            sx={{ width: '100%' }}
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            id="address_2"
                            name="address_info.address_2"
                            type='text'
                            value={formFields.address_info.address_2}
                            onChange={handleChangeInput}
                            variant="filled"
                            placeholder="Address 2"
                            autoComplete="address_2"
                            sx={{ width: '100%' }}
                            autoFocus
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl sx={{ ...errorStyle }} error={!!errors?.address_info?.country} >
                            <InputLabel id="country">Country</InputLabel>
                            <Select
                                labelId="country"
                                id="country"
                                name="address_info.country"
                                label="Country"
                                value={formFields?.address_info?.country || ''}
                                defaultValue=""
                                onChange={handleCountryChange}
                                onOpen={() => {
                                    getApi('get-country').then(response => setCountries(response.data))
                                }
                                }
                                renderValue={(value) => {
                                    const countryName = countries && countries.length ? countries.filter((country: any) => country._id === value) : []
                                    return countryName[0].name;
                                }}
                            >
                                <MenuItem value="">Select a Country</MenuItem>
                                {country.map((country: any, index: any) => (
                                    <MenuItem key={index} value={country._id}>{country.name}</MenuItem>
                                ))}
                            </Select>
                            {!!errors?.address_info?.country && <FormHelperText sx={{ color: '#FF5A65' }}>{errors?.address_info?.country}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl sx={{ ...errorStyle }} error={!!errors?.address_info?.state} >
                            <InputLabel id="state">State</InputLabel>
                            <Select
                                labelId="state"
                                id="state"
                                name="address_info.state"
                                label="State"
                                value={formFields?.address_info?.state || ''}
                                defaultValue=""
                                onChange={handleChangeInput}
                                onOpen={() => {
                                    if (formFields.address_info.country) {
                                        getApi(`get-state/${formFields.address_info.country}`).then(res => setStates(res.data))
                                    }
                                }}
                                renderValue={(value) => {
                                    const stateName = states && states.length ? states.filter((state: any) => state._id === value) : [];
                                    return stateName[0].name;
                                }}
                            >
                                <MenuItem value="">Select a State</MenuItem>
                                {state.map((state: any, index: any) => (
                                    <MenuItem key={index} value={state._id}>{state.name}</MenuItem>
                                ))}
                            </Select>
                            {!!errors?.address_info?.state && <FormHelperText sx={{ color: '#FF5A65' }}>{errors?.address_info?.state}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl sx={{ ...errorStyle }} error={!!errors?.address_info?.city}>
                            <InputLabel id="city">City</InputLabel>
                            <Select
                                labelId="city"
                                id="city"
                                name="address_info.city"
                                label="City"
                                value={formFields.address_info.city || ''}
                                defaultValue=""
                                onChange={handleChangeInput}
                                onOpen={() => {
                                    if (formFields.address_info.state) {
                                        getApi(`get-cities/${formFields.address_info.state}`).then(res => setCities(res.data))
                                    }
                                }}
                                renderValue={(value) => {
                                    const cityName = cities && cities.length ? cities.filter((city: any) => city._id === value) : [];
                                    return cityName[0].name;
                                }}
                            >
                                <MenuItem value="">Select a City</MenuItem>
                                {citys.map((city: any, index: any) => (
                                    <MenuItem key={index} value={city._id}>{city.name}</MenuItem>
                                ))}
                            </Select>
                            {!!errors?.address_info?.city && <FormHelperText sx={{ color: '#FF5A65' }}>{errors?.address_info?.city}</FormHelperText>}
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

export default UserModal;