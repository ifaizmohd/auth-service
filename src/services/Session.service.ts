import { v4 as uuidV4 } from 'uuid';
import { sessionStore, userSession } from './types';
import { RedisClient } from './Redis.service';
import { RedisClientType } from 'redis';

export class SessionService {
  private static sessionStore: sessionStore = {};
  static EXPIRY_TIME: number = 60 * 15;
  static redisClient: RedisClientType | null = RedisClient.getClient();

  static async createNewSession(): Promise<string> {
    const sessionId: string = uuidV4();
    this.sessionStore[sessionId] = { createdAt: Date.now() };
    await this.saveSession(sessionId, this.getUserSession(sessionId));
    return sessionId;
  }

  static getUserSession(sessionId: string): userSession {
    return this.sessionStore[sessionId];
  }

  static async saveSession(sessionId: string, session: userSession) {
    if (this.redisClient)
      await this.redisClient.setEx(
        sessionId,
        this.EXPIRY_TIME,
        JSON.stringify(session)
      );
  }
}
