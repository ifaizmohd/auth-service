import ROUTES, { API_PREFIX } from '../routes/Routes.constants';

export const HTTP_STATUS = {
  CONTINUE: 100,
  SUCCESS: {
    OK: 200,
    CREATED: 201,
  },
  REDIRECTION: {
    MOVED_PERMANENTLY: 301,
  },
  CLIENT_ERROR: {
    BAD_REQUEST: 400,
    NOT_AUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    MEDIA_TYPE_NOT_SUPPORTED: 415,
  },
  SERVER_ERROR: {
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
  },
};

/**
 * @deprecated We are moving from bearer authentication to custom header authentication. This method won't be used in further
 * authentication process.
 * @param authHeader
 * @returns
 */
export function extractTokenFromHeader(authHeader: string) {
  return authHeader && authHeader.split(' ')[1];
}

export function isLoginRequest(url: string): boolean {
  return url === `${API_PREFIX}${ROUTES.LOGIN.url}`;
}

export const isRegisterUserRequest = (url: string) => {
  return url === `${API_PREFIX}${ROUTES.REGISTER.url}`;
};

export const skipValidations = (url: string): boolean => {
  return isLoginRequest(url) || isRegisterUserRequest(url);
};

export const isClientRequest = (url: string) => {
  const urlArray = url.split('/');
  return urlArray.includes('client');
};

export const isNavigationRequest = (url: string) => {
  return url === `${API_PREFIX}${ROUTES.GET_NAVIGATION_DATA.url}`;
};

export const RoutesBasedOnRoles = {
  commonRoutes: [
    { name: 'Home', slug: '/' },
    { name: 'My Profile', slug: '/my-profile' },
    { name: 'Login', slug: '/login' },
    { name: 'Sign Up', slug: 'sign-up' },
  ],
  teacher: [{ name: 'Users', slug: '/users' }],
  principal: [
    { name: 'Users', slug: '/users' },
    { name: 'Roles & Permissions', slug: '/roles-permissions' },
  ],
  admin: [
    { name: 'Users', slug: '/users' },
    { name: 'Roles & Permissions', slug: '/roles-permissions' },
  ],
};

export const getUserNavigationBasedOnRoles = (role: string) => {
  switch (role) {
    case 'student':
      return RoutesBasedOnRoles.commonRoutes;
    case 'teacher':
      return [
        ...RoutesBasedOnRoles.commonRoutes,
        ...RoutesBasedOnRoles.teacher,
      ];
    case 'principal':
      return [
        ...RoutesBasedOnRoles.commonRoutes,
        ...RoutesBasedOnRoles.principal,
      ];
    case 'admin':
      return [...RoutesBasedOnRoles.commonRoutes, ...RoutesBasedOnRoles.admin];
    default:
      return RoutesBasedOnRoles.commonRoutes;
  }
};
