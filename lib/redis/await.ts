import { redis } from './db'

export const awaitRedis = async () =>
  new Promise(resolve => {
    if (redis.status === 'ready') resolve()
    else redis.on('ready', () => resolve())
  })
