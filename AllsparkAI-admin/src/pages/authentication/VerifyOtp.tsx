import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import paths from 'routes/paths';
import { ToastContainer } from 'react-toastify';
import { postApi } from 'service/GlobleApi';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'components/OtpInput/OtpInput';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const userLoginDetail = JSON.parse(localStorage.getItem('userLoginDetail') || '');

    const onChange = (value: string) => setOtp(value);

    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        // Verify the OTP here
        if (otp.length !== 6) {
            setError('Invalid OTP');
        } else {
            // Call API to verify OTP
            // If API returns success, setSuccess(true)
            const data = {
                countryCode: '91',
                phoneNumber: userLoginDetail.phoneNo,
                otp: otp
            }
            postApi('verify-otp', data).then((res: any) => {
                if (res.status) {
                    navigate('/');
                }
            });
            setSuccess(true);
        }
    }

    return (
        <>
            <Typography align="center" variant="h3" fontWeight={600} padding="20px">
                Verify Otp
            </Typography>
            <Stack onSubmit={onSubmitHandler} component="form" direction="column" gap={2}>
                <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                    <OtpInput value={otp} valueLength={6} onChange={onChange} />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {success && <div style={{ color: 'green' }}>OTP verified successfully!</div>}

                <Button type="submit" variant="contained" size="medium" fullWidth>
                    Submit
                </Button>

                <ToastContainer />
            </Stack>
        </>
    );
};

export default VerifyOtp;
