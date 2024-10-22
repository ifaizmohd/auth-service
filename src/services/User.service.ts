import { TokenService } from '.';
import User from '../models/User.model';
import { HashService } from './Hash.service';
import { UserType } from './types';
import { ValidationService } from './index';

export class UserService {
  static async findUserByEmail(email: string) {
    return await User.findOne({ email });
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
    // generating accessToken.
    const accessToken = TokenService.generateToken(`${newUser?._id}`, '1h');
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
      const accessToken = TokenService.generateToken(
        `${existingUser._id}`,
        '1h'
      );
      return {
        message: 'User logged-in successfully!',
        httpStatus: 201,
        accessToken,
      };
    }
    return {
      message:
        'Password does not match with the existing one, did you forget the password?',
      httpStatus: 409,
    };
  }
}
