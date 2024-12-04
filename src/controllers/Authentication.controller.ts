import { Request, Response } from 'express';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { BaseController } from './BaseController';
import ROUTES from '../routes/Routes.constants';
import { TokenService, UserService } from '../services';
import { SessionService } from '../services/Session.service';
import { getUserNavigationBasedOnRoles, HTTP_STATUS } from '../utils';
import { CustomRequest } from './types';

/**
 * Authentication controller for handling user registration, login, and authentication.
 *
 * This controller inherits from a base controller (assumed to be defined elsewhere) and defines routes for user registration, login, and authentication using tokens.
 */
class AuthenticationController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  /**
   * Initializes the routes for the authentication controller.
   *
   * Binds the appropriate methods to the defined routes (e.g., registerUser, login)
   */
  initializeRoutes(): void {
    this.router.post(ROUTES.REGISTER.url, this.registerUser);
    this.router.post(ROUTES.LOGIN.url, this.login);
    this.router.post(ROUTES.AUTHENTICATE.url, this.authenticateUser);
    this.router.get(ROUTES.GET_USER_SESSION.url, this.getUserSession);
    this.router.get(ROUTES.GET_NAVIGATION_DATA.url, this.getNavigationData);
  }

  /**
   * Handles user registration requests.
   *
   * Receives user data from the request body, delegates user creation to the UserService, and sends a response with the registration status and optional access token.
   *
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The outgoing response object.
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   */
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      // Delegate user creation to the UserService
      const { message, httpStatus, accessToken } = await UserService.saveUser(
        req?.body
      );
      // Set access token header if available
      if (accessToken) res.setHeader('x-auth-token', accessToken);
      // Send response with message and status code
      res.status(httpStatus).json({ message });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  }

  /**
   * Handles user login requests.
   *
   * Receives email and password from the request body, delegates user login to the UserService, and sends a response with the login status and optional access token.
   *
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The outgoing response object.
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Extract email and password from the request body
      const { email, password } = req?.body || {};
      // Delegate user login to the UserService.
      const { message, httpStatus, accessToken, data } =
        await UserService.userLogin(email, password);
      // Set access token header if available.
      if (accessToken) res.setHeader('x-auth-token', accessToken);
      // Send response with message and status code
      res.status(httpStatus).json({ message, data });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  }

  /**
   * Handles user authentication using a token.
   *
   * Extracts the token from the authorization header, verifies it using the TokenService, and sends a response with the user information if successful or an error message if unsuccessful.
   *
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The outgoing response object.
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   */
  async authenticateUser(req: Request, res: Response): Promise<void> {
    try {
      // Extract token from authorization header
      const token = <string>req.headers['x-auth-token'] || '';
      // Define callback function for token verification
      const callback = (
        err: VerifyErrors | null,
        user: JwtPayload | undefined | string
      ) => {
        if (err) {
          res.status(403).json({ message: err.message, name: err.name });
        } else {
          res.status(201).json({ user });
        }
      };
      TokenService.verifyToken(token, callback);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  }

  async getUserSession(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = req?.cookies?.sessionId;
      const userSession = SessionService.getUserSession(sessionId);
      if (sessionId) {
        res.status(HTTP_STATUS.SUCCESS.OK).json({ userSession });
      } else {
        res.status(HTTP_STATUS.SUCCESS.OK).json({});
      }
    } catch (error) {
      console.log('Error occurred in getuserSession - \n', error);
    }
  }

  getNavigationData(req: CustomRequest, res: Response): void {
    const { user } = req;
    if (user && user.role) {
      const navData = getUserNavigationBasedOnRoles(user?.role?.name);
      res.status(HTTP_STATUS.SUCCESS.OK).json(navData);
    } else {
      const navData = getUserNavigationBasedOnRoles('test-user');
      res.status(HTTP_STATUS.SUCCESS.OK).json(navData);
    }
  }
}

export default new AuthenticationController().router;
