import Redis from 'ioredis';
import { config } from './config.js'; // Ensure config is exported as ES module
const redis = new Redis(config.redis);

export async function getRedisInstance(key) {
  const value = await redis.get(key);
  return value;
}

export async function setRedisInstance(key, value) {
  await redis.set(key, value);
}

export async function deleteRedisInstance(key) { // Renamed to avoid reserved keyword issues
  await redis.del(key);
}
