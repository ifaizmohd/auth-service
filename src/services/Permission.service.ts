import { Types } from 'mongoose';
import Permission from '../models/Permission.model';
import { ResponseObject } from '../models/ResponseObject.model';
import { HTTP_STATUS } from '../utils';

export class PermissionService {
  static async findPermissionById(id: Types.ObjectId) {
    const permission = await Permission.findOne({ _id: id });
    return new ResponseObject(
      'Permission found!',
      HTTP_STATUS.SUCCESS.OK,
      permission
    );
  }

  static async createNewPermission(permission: string) {
    try {
      const newPermission = new Permission({ name: permission });
      await newPermission.save();
      return new ResponseObject(
        `Permission - ${permission} has been created successfully!`,
        HTTP_STATUS.SUCCESS.CREATED
      );
    } catch (error) {
      return new ResponseObject(
        `Error - permission must be unique, ${error}`,
        HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR
      );
    }
  }

  static async findPermissionByNames(names: [string]) {
    try {
      if (names.length) {
        const permissions = [];
        for (let i = 0; i < names.length; i++) {
          const permission = await Permission.findOne({ name: names[i] });
          if (!permission) {
            return new ResponseObject(
              `Permission - ${names[i]} not found in the Database`,
              HTTP_STATUS.CLIENT_ERROR.NOT_FOUND
            );
          }
          permissions.push(permission);
        }
        return new ResponseObject(
          'Permissions found!',
          HTTP_STATUS.SUCCESS.OK,
          permissions
        );
      } else {
        return new ResponseObject(
          `Please provide roles to apply.`,
          HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST
        );
      }
    } catch (error) {
      return new ResponseObject(
        `Error in findPermissionByName method of Permission service, ${error}`,
        HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR
      );
    }
  }
}
