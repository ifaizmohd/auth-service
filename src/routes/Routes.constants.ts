export const API_PREFIX: string = '/api';
export const USER_PREFIX: string = '/user';
export const ROLE_PREFIX: string = '/role';
export const PERMISSION_PREFIX: string = '/permission';

const ROUTES = {
  REGISTER: '/register',
  LOGIN: '/login',
  AUTHENTICATE: '/authenticate',
  // User Routes.
  GET_USER_PROFILE: '/get-user-profile',
  UPDATE_USER_PROFILE: '/update-profile',
  ASSIGN_ROLE_TO_USER: '/assign-role-to-user',
  // Role routes.
  CREATE_ROLE: '/create-role',
  ADD_PERMISSION_TO_ROLE: '/add-permission-to-role',
  GET_ALL_ROLES: '/get-all-roles',
  // Permission routes.
  CREATE_PERMISSION: '/create-permission',
  GET_PERMISSION_DETAILS: '/get-permission-details',
};

export default ROUTES;
