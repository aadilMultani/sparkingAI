export const rootPaths = {
  root: '/',
  pagesRoot: 'pages',
  authRoot: 'authentication',
  errorRoot: 'error',
};

export default {
  dashboard: `/${rootPaths.pagesRoot}/dashboard`,
  user: `/${rootPaths.pagesRoot}/user`,
  client_detail: `/${rootPaths.pagesRoot}/client/details`,
  client_history: `/${rootPaths.pagesRoot}/client/history`,
  jobs: `/${rootPaths.pagesRoot}/jobs`,
  workers: `/${rootPaths.pagesRoot}/workers`,
  schedules: `/${rootPaths.pagesRoot}/schedules`,
  settings: `/${rootPaths.pagesRoot}/settings`,
  templatePages: `/${rootPaths.pagesRoot}/template-pages`,
  accountSettings: `/${rootPaths.pagesRoot}/account-settings`,

  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  verifyOtp: `/${rootPaths.authRoot}/verify-otp`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  comingSoon: `/coming-soon`,
  404: `/${rootPaths.errorRoot}/404`,
};
