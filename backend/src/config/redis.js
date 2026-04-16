import Redis from 'ioredis';

let client = null;

export function getRedis() {
  if (client) return client;
  if (!process.env.REDIS_URL) return null;
  client = new Redis(process.env.REDIS_URL, { lazyConnect: true });
  client.connect().catch((err) => console.warn('Redis connect failed:', err.message));
  return client;
}
