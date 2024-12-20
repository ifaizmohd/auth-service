import User from '../models/User.model';
import { UserType } from './types';
import {
  ValidationService,
  HashService,
  UserProfileService,
  TokenService,
} from './index';
import { DEFAULT_ROLE } from './constants';

export class UserService {
  static async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  static async findUserById(userId: string) {
    return await User.findOne({ _id: userId });
  }

  static async saveUser(user: UserType) {
    // Validating user.
    const { message, isValid, field } = ValidationService.validateUser(user);
    if (!isValid) {
      throw new Error(`${message} provided for field - ${field}`);
    }
    const { name, email, password } = user;
    const isExisting = await this.findUserByEmail(email);
    if (isExisting) {
      return {
        message: 'User already exists',
        httpStatus: 409,
      };
    }
    // generating hash.
    const hashPassword = await HashService.hashPassword(password);
    // saving user.
    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();
    // create new user profile for user.
    await UserProfileService.createNewUserProfile(newUser?._id);
    // generating accessToken.
    const accessToken = TokenService.generateToken(
      `${newUser?._id}`,
      TokenService.getTokenExpiryTime('user')
    );
    return {
      message: 'User created successfully',
      accessToken,
      httpStatus: 200,
    };
  }

  static async userLogin(email: string, password: string) {
    const { message, isValid, field } =
      ValidationService.validateUserCredentials(email, password);
    if (!isValid) {
      throw new Error(`${message} provided for field - ${field}`);
    }
    // check for user existing user.
    const existingUser = await this.findUserByEmail(email);
    if (!existingUser) {
      return {
        message: 'User does not exist, please sign up first!',
        httpStatus: 409,
      };
    }
    const isPasswordMatched = await HashService.comparePassword(
      password,
      existingUser.password
    );
    if (isPasswordMatched) {
      const role = await UserProfileService.getUserRole(
        existingUser._id.toString()
      );
      const accessToken = TokenService.generateToken(
        `${existingUser._id}`,
        TokenService.getTokenExpiryTime(role?.name || DEFAULT_ROLE)
      );
      return {
        message: 'User logged-in successfully!',
        httpStatus: 200,
        accessToken,
        data: {
          name: existingUser.name,
          email: existingUser.email,
          role: role?.name,
          permissions: role?.permissions,
        },
      };
    }
    return {
      message:
        'Password does not match with the existing one, did you forget the password?',
      httpStatus: 409,
    };
  }
}
