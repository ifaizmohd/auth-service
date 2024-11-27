import { NextFunction, Response } from 'express';
import { CustomRequest } from '../controllers/types';
import { IPermissionsService } from '../types/PermissionsMiddlewareInterface';
import {
  findMissingPermissions,
  getPermissionBasedOnRoute,
  parseUrlForPermissionsMatch,
} from './utils';
import {
  HTTP_STATUS,
  isClientRequest,
  isNavigationRequest,
  skipValidations,
} from '../utils';

export class PermissionMiddleware implements IPermissionsService {
  hasPermissions(req: CustomRequest, res: Response, next: NextFunction): void {
    try {
      if (
        skipValidations(req.url) ||
        isClientRequest(req.url) ||
        isNavigationRequest(req.url)
      ) {
        next();
      } else {
        if (req?.user) {
          const { role } = req?.user || {};
          const permissionsRequired = getPermissionBasedOnRoute(
            `/${parseUrlForPermissionsMatch(req.url)}`
          );
          const missingPermissions = findMissingPermissions(
            role.permissions,
            permissionsRequired
          );
          if (missingPermissions) {
            res.status(HTTP_STATUS.CLIENT_ERROR.NOT_AUTHORIZED).json({
              message: `${missingPermissions} is required to proceed!`,
            });
          } else {
            next();
          }
        }
      }
    } catch (error) {
      console.log(
        'Error occurred while validating the Permissions. \n ',
        error
      );
      res.status(HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    }
  }
}
