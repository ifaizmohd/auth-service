import { NextFunction, Request, Response } from 'express';
import {
  getIsAssetsRequest,
  getIsRedirectToClient,
} from '../utils/client.utils';

export class ClientMiddleware {
  redirectToClient(req: Request, res: Response, next: NextFunction) {
    try {
      const isRedirectToClient = getIsRedirectToClient(req.url);
      const isAssetsRequest = getIsAssetsRequest(req.url);
      if (isAssetsRequest) {
        next();
      } else if (isRedirectToClient) {
        return res.redirect('/client/');
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
