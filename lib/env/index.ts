/* eslint-disable prettier/prettier */
import { registerInt, registerString } from "./register"

// #region Globals
const NODE_ENV = registerString('NODE_ENV')
const IS_PROD = NODE_ENV?.toLowerCase() === 'production'
export const IS_DEV = !IS_PROD

export const IS_SERVER = typeof window === 'undefined'
// #endregion

// #region Application
export const CONFIG_PATH = registerString('CONFIG_PATH')
// #endregion

// #region Redis
export const REDIS_HOST = registerString('REDIS_HOST') ?? (IS_DEV ? 'localhost' : 'redis')
export const REDIS_PORT = registerInt('REDIS_PORT') ?? 6379
export const REDIS_PASS = registerString('REDIS_PASS')
export const REDIS_DB_BASE = registerInt('REDIS_DB_BASE') ?? 0
// #endregion
