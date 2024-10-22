import bcrypt from 'bcrypt';

export class HashService {
  static saltRounds = 12;

  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
