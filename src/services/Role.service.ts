import { Types } from 'mongoose';
import Role from '../models/Role.model';
import { PermissionService, ValidationService } from './index';
import { ResponseObject } from '../models/ResponseObject.model';
import { HTTP_STATUS } from '../utils';

export class RoleService {
  static async findRoleByUserProfile(
    roleId: Types.ObjectId | null | undefined
  ) {
    return await Role.findById({ _id: roleId });
  }

  static async createRole(name: string) {
    // Validating role.
    const { message, isValid } = ValidationService.validateRole(name);
    if (!isValid) {
      return new ResponseObject(
        `Role validation error - ${message}`,
        HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST
      );
    }
    const newRole = new Role({ name });
    await newRole.save();
    return new ResponseObject(
      `Role - ${name} created successfully!`,
      HTTP_STATUS.SUCCESS.CREATED
    );
  }

  static async addPermissions(permissions: [string], roleName: string) {
    try {
      const { message, httpStatus, payload } =
        await PermissionService.findPermissionByNames(permissions);
      if (!payload) {
        return new ResponseObject(message, httpStatus);
      }
      await Role.findOneAndUpdate(
        { name: roleName },
        { $push: { permissions: payload } }
      );
      return new ResponseObject(
        `Permissions - ${permissions} added successfully!`,
        HTTP_STATUS.SUCCESS.OK
      );
    } catch (error) {
      return new ResponseObject(
        `Error occurred in addPermission method of Role service - ${error}`,
        HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR
      );
    }
  }

  static async getAllRoles() {
    try {
      const roles = await Role.find({}).populate('permissions');
      return new ResponseObject(
        `Total ${roles.length} Roles found`,
        HTTP_STATUS.SUCCESS.OK,
        roles
      );
    } catch (error) {
      return new ResponseObject(
        `Error occurred in getAllRoles method of Role service - ${error}`,
        HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR
      );
    }
  }

  static async getRole(role: string) {
    return await Role.findOne({ name: role });
  }
}
