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
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    MEDIA_TYPE_NOT_SUPPORTED: 415,
  },
  SERVER_ERROR: {
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
  },
};

export function extractTokenFromHeader(authHeader: string) {
  return authHeader && authHeader.split(' ')[1];
}
