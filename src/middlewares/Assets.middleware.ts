import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { HTTP_STATUS } from '../utils';
import { getIsAssetsRequest } from '../utils/client.utils';

export class AssetsMiddleware {
  async assetsHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const isAssetsRequest = getIsAssetsRequest(req.url);
      if (isAssetsRequest) {
        const url = req.url;
        const filePath = path.join(__dirname, '../..', url);
        res.status(HTTP_STATUS.SUCCESS.OK).sendFile(filePath);
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    }
  }
}
