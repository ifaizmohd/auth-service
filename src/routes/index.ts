import { Express } from 'express';
import {
  AuthController,
  PermissionController,
  RoleController,
  UserProfileContoller,
} from '../controllers';
import {
  API_PREFIX,
  PERMISSION_PREFIX,
  ROLE_PREFIX,
  USER_PREFIX,
} from './Routes.constants';

export function registerRutes(app: Express) {
  app.use(API_PREFIX, AuthController);
  app.use(`${API_PREFIX}${USER_PREFIX}`, UserProfileContoller);
  app.use(`${API_PREFIX}${ROLE_PREFIX}`, RoleController);
  app.use(`${API_PREFIX}${PERMISSION_PREFIX}`, PermissionController);
}
