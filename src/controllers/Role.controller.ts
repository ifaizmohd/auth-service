import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { RoleService } from '../services/Role.service';
import ROUTES from '../routes/Routes.constants';

class RoleController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get(ROUTES.GET_ALL_ROLES.url, this.getRoles);
    this.router.post(ROUTES.CREATE_ROLE.url, this.createNewRole);
    this.router.put(
      ROUTES.ADD_PERMISSION_TO_ROLE.url,
      this.addPermissionToRole
    );
  }

  /**
   * Handles the creation of a new role. it accepts name in the request body to create a role.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async createNewRole(req: Request, res: Response) {
    try {
      const { name } = req.body || {};
      const { message, httpStatus } = await RoleService.createRole(name);
      res.status(httpStatus).json(message);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  }

  async addPermissionToRole(req: Request, res: Response) {
    try {
      const { roleName, permissions } = req?.body || {};
      const { message, httpStatus } = await RoleService.addPermissions(
        permissions,
        roleName
      );
      res.status(httpStatus).json(message);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  }

  async getRoles(req: Request, res: Response) {
    try {
      const { message, httpStatus, payload } = await RoleService.getAllRoles();
      res.status(httpStatus).json({ message, payload });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  }
}

export default new RoleController().router;
