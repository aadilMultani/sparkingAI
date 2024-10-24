import * as yup from 'yup';

export const userValidationSchema = yup.object().shape({
    name: yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name must be at most 50 characters long'),
    email: yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    phoneNo: yup.string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Invalid phone number'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long'),
    rating: yup.number()
        .required('Rating is required')
        .min(0, 'Rating must be between 0 and 5')
        .max(5, 'Rating must be between 0 and 5'),
    role: yup.string()
        .required('Role is required'),
    address_info: yup.object().shape({
        // address_1: yup.string()
        //     .required('Address 1 is required')
        //     .min(3, 'Address 1 must be at least 3 characters long')
        //     .max(100, 'Address 1 must be at most 100 characters long'),
        // address_2: yup.string()
        //     .required('Address 2 is required')
        //     .min(3, 'Address 2 must be at least 3 characters long')
        //     .max(100, 'Address 2 must be at most 100 characters long'),
        country: yup.string()
            .required('Country is required'),
        state: yup.string()
            .required('State is required'),
        city: yup.string()
            .required('City is required'),
    }),
});