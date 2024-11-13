import { ROLES } from '../models/constants';
import { ValidationObject } from '../models/ValidationObject.model';
import { UserType } from './types';

export class ValidationService {
  private static validatePassword(password: string): boolean {
    if (password.length >= 6) return true;
    return false;
  }

  private static validateName(name: string): boolean {
    if (name.length >= 5) return true;
    return false;
  }

  private static validateEmail(email: string): boolean {
    if (email.indexOf('@') > -1) return true;
    return false;
  }

  static validateUser(user: UserType) {
    const { name, email, password } = user;
    // validate user name.
    if (!this.validateName(name)) {
      return {
        message: 'Name should be greater than 6 letters',
        field: 'name',
        isValid: false,
      };
    }
    if (!this.validateEmail(email)) {
      return {
        message: 'Invalid details',
        field: 'email',
        isValid: false,
      };
    }
    if (!this.validatePassword(password)) {
      return {
        message: 'Invalid details',
        field: 'password',
        isValid: false,
      };
    }
    return {
      message: 'User validation completed successfully.',
      isValid: true,
    };
  }

  static validateUserCredentials(email: string, password: string) {
    if (!this.validateEmail(email)) {
      return {
        message: 'Invalid credentials',
        field: 'email',
        isValid: false,
      };
    }
    if (!this.validatePassword(password)) {
      return {
        message: 'Invalid credentials',
        field: 'password',
        isValid: false,
      };
    }
    return {
      message: 'User validation completed successfully.',
      isValid: true,
    };
  }

  static validateRole(name: string) {
    if (ROLES.indexOf(name) > -1) {
      return {
        message: 'Role validation completed successfully!',
        isValid: true,
      };
    }
    return {
      message: 'Role name is incorrect!',
      isValid: false,
    };
  }

  static isUserManagementReadAccess(permissions: [string]) {
    if (permissions.indexOf('user-mgmt-read') > -1) {
      return new ValidationObject(true, 'Access granted');
    }
    return new ValidationObject(false, 'Access Denied');
  }
}
