import { v4 as uuidV4 } from 'uuid';
import { sessionStore, userSession } from './types';
import { RedisClient } from './Redis.service';
import { RedisClientType } from 'redis';
import { IUserSessionData } from '../types/AuthMiddlewareInterface';

/**
 * Session service for managing user sessions.
 *
 * This service handles creating new sessions, retrieving user sessions, and storing them in a session store (in-memory or Redis).
 */
export class SessionService {
  /**
   * In-memory store for sessions (used if Redis is not available).
   * @private
   */
  private static sessionStore: sessionStore = {};
  /**
   * Session expiration time in seconds (default: 15 minutes).
   */
  static EXPIRY_TIME: number = 60 * 15;
  /**
   * Redis client instance for storing sessions (optional).
   */
  static redisClient: RedisClientType | null = RedisClient.getClient();

  /**
   * Creates a new session and returns the session ID.
   *
   * @returns {Promise<string>} A promise that resolves with the newly created session ID.
   */
  static async createNewSession(
    userData?: IUserSessionData | undefined
  ): Promise<string> {
    // Generate a unique session ID
    const sessionId: string = uuidV4();
    // Initialize a new session object
    this.sessionStore[sessionId] = { createdAt: Date.now(), userData };
    // Save the session to the session store (in-memory or Redis)
    await this.saveSession(sessionId, this.sessionStore[sessionId]);
    // Return the newly created session ID
    return sessionId;
  }

  /**
   * Retrieves the user session data associated with the provided session ID.
   *
   * @param {string} sessionId - The ID of the user session.
   * @returns {userSession} The user session data or undefined if not found.
   */
  static async getUserSession(sessionId: string): Promise<userSession | null> {
    const session = await this.redisClient?.get(sessionId);
    return session ? (JSON.parse(session) as userSession) : null;
  }

  /**
   * Saves the user session data to the session store (in-memory or Redis).
   *
   * @param {string} sessionId - The ID of the user session.
   * @param {userSession} session - The user session data to be saved.
   * @returns {Promise<void>} A promise that resolves when the session is saved.
   */
  static async saveSession(
    sessionId: string,
    session: userSession
  ): Promise<void> {
    // Store the session data in Redis with an expiration time
    if (this.redisClient)
      await this.redisClient.set(sessionId, JSON.stringify(session), {
        EX: this.EXPIRY_TIME,
      });
    else {
      // If Redis is not available, use the in-memory session store
      this.sessionStore[sessionId] = session;
    }
  }

  static async updateSession(sessionId: string, updates: object) {
    try {
      // fetch the existing session.
      const sessionData = await this.redisClient?.get(sessionId);
      if (!sessionData) {
        await this.createNewSession();
        return;
      }
      const parsedData = JSON.parse(sessionData);
      const updatedSession = { ...parsedData, ...updates };
      await this.redisClient?.set(sessionId, JSON.stringify(updatedSession), {
        EX: this.EXPIRY_TIME,
      });
    } catch (error) {
      console.error(`Failed to update session: ${sessionId}`, error);
    }
  }
}
