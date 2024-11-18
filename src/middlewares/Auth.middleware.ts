import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS, isLoginRequest, isRegisterUserRequest } from '../utils';
import { TokenService, UserProfileService } from '../services';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { UserTokenPayload } from '../controllers/types';
import {
  IAuthService,
  IRole,
  IUserSessionData,
} from '../types/AuthMiddlewareInterface';

/**
 * Authentication middleware for verifying user tokens and enriching request object with user data.
 *
 * This middleware intercepts incoming requests, checks for authentication tokens (except login and register requests), verifies the token using TokenService, retrieves user details from the session store (Redis), and adds the user data to the request object for further processing.
 */
export class AuthMiddleware implements IAuthService {
  /**
   * Handles incoming requests by verifying user tokens and enriching the request object with user data.
   *
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The outgoing response object.
   * @param {NextFunction} next - The next function in the middleware chain.
   * @returns {Promise<void>} A promise that resolves when the middleware processing is complete.
   */
  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Bypassing the login/signup request because it won't have the token and sessionId
    if (isLoginRequest(req.url) || isRegisterUserRequest(req.url)) {
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

  /**
   * Verifies a JWT token using TokenService.
   *
   * @param {string} token - The token to be verified.
   * @param {Response} res - The response object for sending error messages.
   * @returns {UserTokenPayload} The decoded user information from the token if valid, otherwise an empty object.
   */
  verifyToken(token: string, res: Response): UserTokenPayload {
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
   * Retrieves user details from the session store (Redis) for the given user ID.
   *
   * @param {string} userId - The user ID to fetch data for.
   * @returns {Promise<IUserSessionData | null>} A promise that resolves with user session data if found, otherwise null.
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

  /**
   * Constructs user session data with user ID, role name, and role permissions.
   *
   * @param {string} userId - The user ID.
   * @param {IRole} roles - The user's role information.
   * @returns {IUserSessionData} The constructed user session data object.
   */
  getUserData(userId: string, roles: IRole): IUserSessionData {
    return {
      userId,
      role: {
        name: roles.name,
        permissions: roles?.permissions?.map((perm) => perm.name),
      },
    };
  }
}
