import { RedisClientType, createClient } from 'redis';
import { IRedisService } from '../types/RedisServiceInterface';

class RedisService implements IRedisService {
  redisClient: RedisClientType | null = null;

  connect() {
    this.redisClient = createClient();
    try {
      this.redisClient.connect();
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
