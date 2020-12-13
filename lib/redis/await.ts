import { redis } from './db'

export const awaitRedis: () => Promise<void> = async () =>
  new Promise(resolve => {
    if (redis.status === 'ready') resolve()
    else redis.on('ready', () => resolve())
  })
