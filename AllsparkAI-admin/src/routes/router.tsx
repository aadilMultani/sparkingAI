/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import paths, { rootPaths } from './paths';
import MainLayout from 'layouts/main-layout';
import AuthLayout from 'layouts/auth-layout';
import Splash from 'components/loading/Splash';
import PageLoader from 'components/loading/PageLoader';
import VerifyOtp from 'pages/authentication/VerifyOtp';
import ProtectedRoute from './ProtectedRoute';

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard'));
const Jobs = lazy(() => import('pages/jobs'));
const User = lazy(() => import('pages/users'));
const Login = lazy(() => import('pages/authentication/Login'));
const Signup = lazy(() => import('pages/authentication/Signup'));

const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: '/',
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute Component={<Outlet />} />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              index: true,
              element: <Dashboard />,
            }
          ],
        },
        {
          path: rootPaths.authRoot,
          element: (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          ),
          children: [
            {
              path: paths.login,
              element: <Login />,
            },
            {
              path: paths.signup,
              element: <Signup />,
            },
            {
              path: paths.verifyOtp,
              element: <VerifyOtp />,
            },
          ],
        },
        {
          path: rootPaths.pagesRoot,
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute Component={<Outlet />} />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              path: paths.user,
              element: <User />
            },
            // {
            //   path: paths.client_detail,
            //   element: <Client_detail />
            // },
            // {
            //   path: paths.client_history,
            //   element: <Client_history />
            // },
            {
              path: paths.jobs,
              element: <Jobs />
            },
          ]
        }
      ],
    },
  ],
  {
    basename: '/AllsparkAI',
  },
);

export default router;
