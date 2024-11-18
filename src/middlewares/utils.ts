import ROUTES from '../routes/Routes.constants';

export const PERMISSIONS = {
  student: {
    user_mgmt_read: 'user_mgmt_read',
    user_mgmt_basic: 'user_mgmt_basic',
    academics_read: 'academics_read',
  },
  principal: {
    user_mgmt_admin: 'user_mgmt_admin',
    academics_admin: 'academics_admin',
  },
  teacher: {
    user_mgmt_read: 'user_mgmt_read',
    user_mgmt_basic: 'user_mgmt_basic',
    user_mgmt_admin: 'user_mgmt_admin',
    academics_read: 'academics_read',
    academics_write: 'academics_write',
  },
  admin: {
    user_mgmt_admin: 'user_mgmt_admin',
    academics_admin: 'academics_admin',
    administration_admin: 'administration_admin',
  },
};

export function getPermissionBasedOnRoute(url: string): string[] {
  if (!url) return [];
  switch (url) {
    case ROUTES.GET_USER_SESSION.url:
      return ROUTES.GET_USER_SESSION.permissionsRequired;
    case ROUTES.UPDATE_USER_PROFILE.url:
      return ROUTES.UPDATE_USER_PROFILE.permissionsRequired;
    case ROUTES.ASSIGN_ROLE_TO_USER.url:
      return ROUTES.ASSIGN_ROLE_TO_USER.permissionsRequired;
    case ROUTES.CREATE_ROLE.url:
      return ROUTES.CREATE_ROLE.permissionsRequired;
    case ROUTES.ADD_PERMISSION_TO_ROLE.url:
      return ROUTES.ADD_PERMISSION_TO_ROLE.permissionsRequired;
    default:
      return [];
  }
}

export function findMissingPermissions(
  hasPermissions: string[],
  permissionsRequired: string[]
) {
  if (!permissionsRequired.length) return undefined;
  return permissionsRequired.find(
    (permission: string) => !hasPermissions.includes(permission)
  );
}

export const parseUrlForPermissionsMatch = (url: string) => {
  const urlArray = url.split('/');
  return urlArray[urlArray.length - 1];
};
