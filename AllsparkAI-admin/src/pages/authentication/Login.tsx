import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import { toast } from 'react-toastify';
import { postApi } from 'service/GlobleApi';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from 'redux/action/user';
// import { AppDispatch } from 'redux/store';

interface User {
  [key: string]: string;
}

const Login = () => {
  const [user, setUser] = useState<User>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (googleUser !== null) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`, {
          headers: {
            Authorization: `Bearer ${googleUser.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          setProfile({
            ...profile,
            email: res.data.email,
            profilePicture: res.data.picture,
            name: res.data.name,
            googleId: res.data.id,
            isLoginWithGoogle: true
          });
        })
        .catch((err) => console.log(err));
    }
  },
    [googleUser]
  );

  useEffect(() => {
    if (profile !== null) {
      postApi('login', profile).then((res: any) => {
        if (res.status) {
          toast.success('Login Successfull');
          localStorage.setItem('userLoginDetail', JSON.stringify(res.userDetail));
          localStorage.setItem('token', res.token);
          navigate('/');
        }
      })
    }
  }, [profile])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginUser(user, dispatch)
      .then((res: any) => {

        if (res.success === true) {
          localStorage.setItem('userLoginDetail', JSON.stringify(res.userDetail));
          localStorage.setItem('token', res.token);
          // navigate(`${paths.verifyOtp}`);
          // toast.success('Login Successfull');
          navigate('/');
        } else {
          toast.error(res.message);
        }
      }).catch((error: any) => {
        toast.error(error);
      })
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => setGoogleUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  const handleGoogleLogin = () => {
    login();
  };

  return (
    <>
      <Typography align="center" variant="h3" fontWeight={600}>
        LogIn
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} mt={4} spacing={2} width={1}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<IconifyIcon icon="uim:google" />}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<IconifyIcon icon="uim:apple" />}
        >
          Login with Apple
        </Button>
      </Stack>
      <Divider sx={{ my: 3 }}>or Login with</Divider>
      <Stack onSubmit={handleSubmit} component="form" direction="column" gap={2}>
        <TextField
          id="email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Email"
          autoComplete="email"
          fullWidth
          autoFocus
          required
        />
        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={user.password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Password"
          autoComplete="current-password"
          fullWidth
          autoFocus
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ opacity: user.password ? 1 : 0 }}>
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
        <Stack mt={-1.5} alignItems="center" justifyContent="space-between">
          <FormControlLabel
            control={<Checkbox id="checkbox" name="checkbox" color="primary" />}
            label="Remember me"
          />
          <Link href="#!" fontSize="body2.fontSize" letterSpacing={0.5}>
            Forgot password?
          </Link>
        </Stack>
        <Button type="submit" variant="contained" size="medium" fullWidth>
          Submit
        </Button>
        <Typography
          my={3}
          color="text.secondary"
          variant="body2"
          align="center"
          letterSpacing={0.5}
        >
          Don't have an account? <Link href={paths.signup}>{'Signup'}</Link>
        </Typography>
      </Stack>
    </>
  );
};

export default Login;