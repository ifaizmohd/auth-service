import { RedisClientType } from 'redis';

export interface IRedisService {
  redisClient: RedisClientType | null;
  connect(): void;
  getClient(): void;
}
