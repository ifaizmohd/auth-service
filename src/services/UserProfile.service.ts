import { Types } from 'mongoose';
import UserProfile from '../models/UserProfile.model';
import { RoleService } from './index';
import { ResponseObject } from '../models/ResponseObject.model';
import { HTTP_STATUS } from '../utils';

export class UserProfileService {
  static async getUserProfile(userId: string) {
    const userProfile = await UserProfile.findOne({ userId });
    return new ResponseObject(
      `User profile successfully found!`,
      HTTP_STATUS.SUCCESS.OK,
      userProfile
    );
  }

  static async createNewUserProfile(userId: Types.ObjectId) {
    try {
      const newUserProfile = new UserProfile({ userId });
      await newUserProfile.save();
      // Add logging here
    } catch (error) {
      throw new Error(
        `Error occurred while creating new user profile - ${userId} \n Error - ${error}`
      );
    }
  }

  static async updateUserProfile(userId: string | undefined, fields: object) {
    try {
      if (!userId) {
        throw new Error('Please provide a valid userId');
      }
      const filter = { userId };
      await UserProfile.findOneAndUpdate(filter, { ...fields });
      return new ResponseObject(
        `User profile updated successfully - ${userId}`,
        HTTP_STATUS.SUCCESS.OK
      );
    } catch (error) {
      throw new Error(
        `Error occurred while updating the user profile - ${userId} and fields - ${Object.keys(fields)} \n Error - ${error}`
      );
    }
  }

  static async findUserProfileByUserId(userId: string | Types.ObjectId) {
    return await UserProfile.findOne({ userId }).populate('role.name');
  }

  static async getUserRole(userId: string) {
    const userProfile = await this.findUserProfileByUserId(userId);
    return await RoleService.findRoleByUserProfile(userProfile?.role);
  }

  static async assignRoleToUser(userId: string, roleName: string) {
    try {
      const role = await RoleService.getRole(roleName);
      await UserProfile.findOneAndUpdate({ userId }, { role: role?._id });
      return new ResponseObject(
        `Role - ${roleName} is successfully assigned to the user - ${userId}`,
        HTTP_STATUS.SUCCESS.OK
      );
    } catch (error) {
      return new ResponseObject(
        `Error occurred in assignRoleToUser method of UserProfileService class. \n ${error}`,
        HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR
      );
    }
  }
}
