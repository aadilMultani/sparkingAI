import paths from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Dashboard',
    path: '/',
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  // {
  //   id: 'client',
  //   subheader: 'Client',
  //   icon: 'mingcute:user-5-fill',
  //   items: [
  //     {
  //       name: 'Clients Detail',
  //       pathName: 'details',
  //       path: paths.client_detail,
  //     },
  //     {
  //       name: 'Client History',
  //       pathName: 'history',
  //       path: paths.client_history,
  //     },
  //   ],
  // },
  {
    id: 'users',
    subheader: 'Users',
    path: paths.user,
    icon: 'mingcute:user-5-fill',
    active: true
  },
  {
    id: 'jobs',
    subheader: 'jobs',
    path: paths.jobs,
    icon: 'mingcute:briefcase-2-fill',
    active: true
  },
  {
    id: 'workers',
    subheader: 'Workers',
    path: paths.workers,
    icon: 'mingcute:group-3-fill',
    active: true
  },
  {
    id: 'schedules',
    subheader: 'Schedules',
    path: paths.schedules,
    icon: 'mingcute:calendar-time-add-fill',
    active: true
  },
  {
    id: 'authentication',
    subheader: 'Authentication',
    icon: 'mingcute:safe-lock-fill',
    items: [
      {
        name: 'Login',
        pathName: 'login',
        path: paths.login,
      },
      {
        name: 'Signup',
        pathName: 'signup',
        path: paths.signup,
      },
    ],
  },
  {
    id: 'settings',
    subheader: 'Settings',
    path: '#!',
    icon: 'material-symbols:settings-rounded',
    active: true,
  },
  {
    id: 'account-settings',
    subheader: 'John Carter',
    path: '#!',
  },
];

export default sitemap;