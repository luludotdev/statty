import { Status } from './types'

export interface PluginReponse {
  /**
   * Latency to target (in millis)
   */
  latency: number

  /**
   * Target Status
   */
  status: Status
}

export interface Plugin {
  type: string
  target: string
  limit: number

  id: string
  description: () => string

  run: () => PluginReponse | Promise<PluginReponse>
}

export interface PluginOptions {
  /**
   * Plugin target
   */
  target: string

  /**
   * Unique Plugin ID
   */
  id: string

  /**
   * Plugin Description
   *
   * Shown on the web client
   */
  description?: string

  /**
   * Limit for acceptable latency (in millis)
   *
   * Defaults to 1000ms
   */
  latencyLimit?: number
}

export const IS_FACTORY = Symbol('isFactory')
export const DEFAULT_LATENCY_LIMIT = 1000
export const UNKNOWN_LATENCY = 0

export interface PluginFactory<T = Record<string, unknown>> {
  type: string
  isFactory: symbol

  (options: PluginOptions & T): Plugin
}

export const createFactory: <T>(
  type: string,
  factory: (options: PluginOptions & T) => Plugin
) => PluginFactory<T> = (type, factory) => {
  return Object.assign(factory, { type, isFactory: IS_FACTORY })
}
