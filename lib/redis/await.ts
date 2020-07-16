import { redis } from './db'

export const awaitRedis = async () =>
  new Promise(resolve => {
    if (redis.status === 'ready') return resolve()
    redis.on('ready', () => resolve())
  })
