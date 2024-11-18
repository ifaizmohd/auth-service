import { Response } from 'express';
import { BaseController } from './BaseController';
import { UserProfileService } from '../services/UserProfile.service';
import { AuthRequest } from './types';
import ROUTES from '../routes/Routes.constants';

class UserProfileController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.put(ROUTES.UPDATE_USER_PROFILE.url, this.updateProfile);
    this.router.put(ROUTES.ASSIGN_ROLE_TO_USER.url, this.assignRoleToTheUser);
    this.router.get(ROUTES.GET_USER_PROFILE.url, this.getUserProfile);
  }

  async getUserProfile(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.body || {};
      const { message, httpStatus, payload } =
        await UserProfileService.getUserProfile(userId);
      res.status(httpStatus).json({ message, payload });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const fields = req?.body || {};
      const { userId } = req?.user || {};
      await UserProfileService.updateUserProfile(userId, fields);
      res.status(201).json({ message: 'User profile updated successfully!' });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  }

  async assignRoleToTheUser(req: AuthRequest, res: Response) {
    try {
      const { userId, roleName } = req?.body || {};
      const { message, httpStatus } = await UserProfileService.assignRoleToUser(
        userId,
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
}

export default new UserProfileController().router;
