import { NextFunction, Request, Response } from 'express';
import { extractTokenFromHeader, HTTP_STATUS } from '../utils';
import {
  TokenService,
  UserProfileService,
  ValidationService,
} from '../services';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { AuthRequest } from '../controllers/types';

export class AuthMiddleware {
  static isUserLoggedIn(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers['authorization'] || '';
      const token = extractTokenFromHeader(authHeader);
      const callback = (
        err: VerifyErrors | null,
        payload: JwtPayload | undefined | string
      ) => {
        if (err) {
          res.status(403).json({ message: err.message, name: err.name });
        } else {
          Object.defineProperty(req, 'user', {
            value: payload,
          });
          next();
        }
      };
      TokenService.verifyToken(token, callback);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error occurred while validating user.' });
    }
  }

  static async isUserPermitted(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req?.user || {};
      if (userId) {
        const userRole = await UserProfileService.getUserRole(userId);
        const permissions: [string] = <[string]>(
          userRole?.permissions?.map((permission) => permission?.name)
        );
        const { isValid, message } =
          ValidationService.isUserManagementReadAccess(permissions);
        if (!isValid) {
          res.status(HTTP_STATUS.CLIENT_ERROR.FORBIDDEN).json(message);
        } else {
          next();
        }
      } else {
        res
          .status(HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST)
          .json({ message: 'Please login to perform this action.' });
      }
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error occurred while validating user permissions.' });
    }
  }
}
