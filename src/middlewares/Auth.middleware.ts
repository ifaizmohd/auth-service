import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS, isLoginRequest } from '../utils';
import { TokenService, UserProfileService } from '../services';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { UserTokenPayload } from '../controllers/types';
import {
  IAuthService,
  IRole,
  IUserSessionData,
} from '../types/AuthMiddlewareInterface';

export class AuthMiddleware implements IAuthService {
  /**
   * 1. extract the token from request.
   * 2. verify the token is valid or not.
   * 3. verify the session is valid or not.
   * 4. if all data is valid then set the user data in the session.
   * 5. if not then return the response.
   * * Note: check for guest user session.
   * @param req
   * @param res
   * @param next
   */
  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Bypassing the login request because it won't have the token and sessionId
    if (isLoginRequest(req.url)) {
      next();
    } else {
      // extract the token from request header.
      const token = <string>req.headers['x-auth-token'] || '';
      // verify the token.
      const user: UserTokenPayload = this.verifyToken(token, res);
      if (user && user.userId) {
        // verify the sessionId in redis.
        const userData = await this.getUserDetailsForSession(user?.userId);
        Object.defineProperty(req, 'user', { value: userData });
      }
      next();
    }
  }

  verifyToken(token: string, res: Response) {
    let user: UserTokenPayload = { iat: 0, userId: '', exp: 0 };
    const callback = (
      err: VerifyErrors | null,
      payload: JwtPayload | undefined | string
    ) => {
      if (err) {
        res
          .status(HTTP_STATUS.CLIENT_ERROR.NOT_AUTHORIZED)
          .json({ message: 'Invalid Token' });
      } else {
        user = <UserTokenPayload>payload;
      }
    };
    TokenService.verifyToken(token, callback);
    return user;
  }

  /**
   * 1. get the user object.
   * 2. get the user profile.
   * 3. get the user roles if any.
   * 4. return the minimum data required to save in session like roles and permissions.
   * @param userId
   */
  async getUserDetailsForSession(
    userId: string
  ): Promise<IUserSessionData | null> {
    const roles = await UserProfileService.getUserRole(userId);
    if (roles) {
      return this.getUserData(userId, roles);
    }
    return null;
  }

  getUserData(userId: string, roles: IRole): IUserSessionData {
    return {
      userId,
      role: {
        name: roles.name,
        permissions: roles?.permissions?.map((perm) => perm.name),
      },
    };
  }

  // static isUserLoggedIn(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const authHeader = <string>req.headers['x-auth-token'] || '';
  //     const token = extractTokenFromHeader(authHeader);
  //     const callback = (
  //       err: VerifyErrors | null,
  //       payload: JwtPayload | undefined | string
  //     ) => {
  //       if (err) {
  //         res.status(403).json({ message: err.message, name: err.name });
  //       } else {
  //         Object.defineProperty(req, 'user', {
  //           value: payload,
  //         });
  //         next();
  //       }
  //     };
  //     TokenService.verifyToken(token, callback);
  //   } catch (error) {
  //     console.error(error);
  //     res
  //       .status(500)
  //       .json({ message: 'Error occurred while validating user.' });
  //   }
  // }

  // static async isUserPermitted(
  //   req: AuthRequest,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { userId } = req?.user || {};
  //     if (userId) {
  //       const userRole = await UserProfileService.getUserRole(userId);
  //       const permissions: [string] = <[string]>(
  //         userRole?.permissions?.map((permission) => permission?.name)
  //       );
  //       const { isValid, message } =
  //         ValidationService.isUserManagementReadAccess(permissions);
  //       if (!isValid) {
  //         res.status(HTTP_STATUS.CLIENT_ERROR.FORBIDDEN).json(message);
  //       } else {
  //         next();
  //       }
  //     } else {
  //       res
  //         .status(HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST)
  //         .json({ message: 'Please login to perform this action.' });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res
  //       .status(HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR)
  //       .json({ message: 'Error occurred while validating user permissions.' });
  //   }
  // }
}
