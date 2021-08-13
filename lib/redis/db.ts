import Redis from 'ioredis'
import { schedule } from 'node-cron'
import process from 'process'
import {
  REDIS_DB_BASE,
  REDIS_HOST,
  REDIS_PASS,
  REDIS_PORT,
  REDIS_URL,
} from '~env'

const createRedis = () => {
  if (REDIS_URL !== undefined) {
    const redis = new Redis(REDIS_URL)
    return redis
  }

  return new Redis({
    db: REDIS_DB_BASE + 0,
    host: REDIS_HOST,
    password: REDIS_PASS,
    port: REDIS_PORT,
  })
}

export const redis = createRedis()
redis.on('error', () => {
  console.log('Failed to connect to Redis')
  process.exit(1)
})

redis.on('ready', () => {
  schedule('0 */12 * * *', async () => redis.bgrewriteaof())
})
