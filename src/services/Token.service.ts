import jwt, { JwtPayload, VerifyCallback } from 'jsonwebtoken';

export class TokenService {
  private static jwtSecret = 'Auth-secret';
  static generateToken(userId: string, expiryTime: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: expiryTime });
  }

  static verifyToken(
    token: string,
    callback: VerifyCallback<string | JwtPayload>
  ) {
    return jwt.verify(token, this.jwtSecret, {}, callback);
  }
}
