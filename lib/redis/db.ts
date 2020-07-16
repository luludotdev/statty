import Redis from 'ioredis'
import { REDIS_DB_BASE, REDIS_HOST, REDIS_PASS, REDIS_PORT } from '~env'

export const redis = new Redis({
  db: REDIS_DB_BASE + 0,
  host: REDIS_HOST,
  password: REDIS_PASS,
  port: REDIS_PORT,
})

redis.on('error', () => {
  console.log('Failed to connect to Redis')
  process.exit(1)
})
