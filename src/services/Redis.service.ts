import { RedisClientType, createClient } from 'redis';
import { IRedisService } from '../types/RedisServiceInterface';

class RedisService implements IRedisService {
  redisClient: RedisClientType | null = null;

  connect() {
    this.redisClient = createClient({
      socket: {
        // setting a 10-second timeout
        connectTimeout: 10000, // in milliseconds
        reconnectStrategy: (retries: number, cause: Error) => {
          if (retries > 20) {
            console.log(
              'Too many attempts to reconnect. Redis connection was terminated',
              cause
            );
            return new Error('Too many retries.');
          } else {
            return retries * 500;
          }
        },
      },
    });

    try {
      this.redisClient.connect();
      this.redisClient.on('error', (e) => console.log(e));
      console.info('Redis Client connected successfully');
    } catch (error) {
      console.error(error);
    }
  }

  getClient() {
    return this.redisClient;
  }
}

export const RedisClient = new RedisService();
