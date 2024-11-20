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
