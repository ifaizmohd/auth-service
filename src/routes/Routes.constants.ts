import { PERMISSIONS } from '../middlewares/utils';

export const API_PREFIX: string = '/api';
export const USER_PREFIX: string = '/user';
export const ROLE_PREFIX: string = '/role';
export const PERMISSION_PREFIX: string = '/permission';
export const CLIENT: string = '/client';

const ROUTES = {
  // Auth routes.
  REGISTER: { url: '/register', permissionsRequired: [] },
  LOGIN: { url: '/login', permissionsRequired: [] },
  AUTHENTICATE: { url: '/authenticate', permissionsRequired: [] },
  GET_USER_SESSION: {
    url: '/get-user-session',
    permissionsRequired: [PERMISSIONS.admin.user_mgmt_admin],
  },
  // User Routes.
  GET_USER_PROFILE: { url: '/get-user-profile', permissionsRequired: [] },
  UPDATE_USER_PROFILE: {
    url: '/update-profile',
    permissionsRequired: [PERMISSIONS.student.user_mgmt_basic],
  },
  ASSIGN_ROLE_TO_USER: {
    url: '/assign-role-to-user',
    permissionsRequired: [PERMISSIONS.admin.user_mgmt_admin],
  },
  // Role routes.
  CREATE_ROLE: {
    url: '/create-role',
    permissionsRequired: [PERMISSIONS.admin.user_mgmt_admin],
  },
  ADD_PERMISSION_TO_ROLE: {
    url: '/add-permission-to-role',
    permissionsRequired: [PERMISSIONS.admin.user_mgmt_admin],
  },
  GET_ALL_ROLES: {
    url: '/get-all-roles',
    permissionsRequired: [PERMISSIONS.admin.user_mgmt_admin],
  },
  // Permission routes.
  CREATE_PERMISSION: {
    url: '/create-permission',
    permissionsRequired: [PERMISSIONS.admin.user_mgmt_admin],
  },
  GET_PERMISSION_DETAILS: {
    url: '/get-permission-details',
    permissionsRequired: [],
  },
};

export default ROUTES;
