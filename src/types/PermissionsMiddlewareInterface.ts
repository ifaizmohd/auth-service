import { NextFunction, Response } from 'express';
import { CustomRequest } from '../controllers/types';

export interface IPermissionsService {
  hasPermissions(req: CustomRequest, res: Response, next: NextFunction): void;
}
