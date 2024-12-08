const Redis = require('ioredis');
const config = require('./config');
const redis = new Redis(config.redis);

module.exports = {
  async get(key) {
    const value = await redis.get(key);
    return value;
  },

  async set(key, value) {
    await redis.set(key, value);
  },

  async delete(key) {
    await redis.del(key);
  },
};