import { Request } from 'express';
import { userSession } from '../services/types';

interface UserTokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: UserTokenPayload;
}

export interface CustomRequest extends Request {
  user?: UserTokenPayload;
  session?: userSession;
}
