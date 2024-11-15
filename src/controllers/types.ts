import { Request } from 'express';
import { userSession } from '../services/types';
import { JwtPayload } from 'jsonwebtoken';
import { IUserSessionData } from '../types/AuthMiddlewareInterface';

export interface UserTokenPayload extends JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: UserTokenPayload;
}

export interface CustomRequest extends Request {
  user?: IUserSessionData;
  session?: userSession;
}
