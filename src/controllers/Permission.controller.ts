import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { PermissionService } from '../services';
import { HTTP_STATUS } from '../utils';
import ROUTES from '../routes/Routes.constants';

class PermissionController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get(ROUTES.GET_PERMISSION_DETAILS.url, this.getPermission);
    this.router.post(ROUTES.CREATE_PERMISSION.url, this.createPermission);
  }

  async getPermission(req: Request, res: Response) {
    try {
      const { id } = req.body || {};
      const { message, httpStatus, payload } =
        await PermissionService.findPermissionById(id);
      res.status(httpStatus).json({ message, payload });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res
          .status(HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  }

  async createPermission(req: Request, res: Response) {
    try {
      const { name } = req?.body || {};
      const { message, httpStatus } =
        await PermissionService.createNewPermission(name);
      res.status(httpStatus).json(message);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res
          .status(HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  }
}

export default new PermissionController().router;
