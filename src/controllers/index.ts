import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import ROUTES from '../routes/Routes.constants';
import { extractTokenFromHeader } from '../utils';
import { TokenService, UserService } from '../services';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';

class AuthenticationController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.post(ROUTES.REGISTER, this.registerUser);
    this.router.post(ROUTES.LOGIN, this.login);
    this.router.post(ROUTES.AUTHENTICATE, this.authenticateUser);
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { message, httpStatus, accessToken } = await UserService.saveUser(
        req?.body
      );
      res.status(httpStatus).json({ message, accessToken });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req?.body || {};
      const { message, httpStatus, accessToken } = await UserService.userLogin(
        email,
        password
      );
      res.status(httpStatus).json({ message, accessToken });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  }

  async authenticateUser(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers['authorization'] || '';
      const token = extractTokenFromHeader(authHeader);
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
}

export default new AuthenticationController().router;
