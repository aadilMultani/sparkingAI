// import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { theme } from 'theme/theme.ts';
import router from 'routes/router.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux'
import store from 'redux/store';
import './index.css';
import { ToastContainer, Zoom } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}>
    {/* <React.StrictMode> */}
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <ToastContainer  transition={Zoom} />
      </ThemeProvider>
    </Provider>
    {/* </React.StrictMode>, */}
  </GoogleOAuthProvider>
);
