import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { UserTokenPayload } from '../controllers/types';

export interface IRole {
  name: string;
  permissions: IPermission[];
  _id: Types.ObjectId;
  _v?: number;
}

export interface IPermission {
  name: string;
}

export interface IUserSessionData {
  userId: string;
  role: {
    name: string;
    permissions: string[];
  };
}

export interface IAuthService {
  handle(req: Request, res: Response, next: NextFunction): void;
  verifyToken(token: string, res: Response): UserTokenPayload;
  getUserDetailsForSession(userId: string): Promise<IUserSessionData | null>;
  getUserData(userId: string, roles: IRole): IUserSessionData;
}
