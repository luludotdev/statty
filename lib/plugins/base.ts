export enum Status {
  /**
   * Target can be reached with acceptable latency
   */
  Operational = 'operational',

  /**
   * Target can be reached with unacceptable latency
   */
  Degraded = 'degraded',

  /**
   * Target cannot be reached
   */
  Unreachable = 'unreachable',

  /**
   * Target status unknown
   */
  Unknown = 'unknown',
}

export interface IPluginReponse {
  /**
   * Latency to target (in millis)
   */
  latency: number

  /**
   * Target Status
   */
  status: Status
}

export interface IPlugin {
  type: string
  target: string

  id: string
  description: string | undefined

  run: () => IPluginReponse | Promise<IPluginReponse>
}

export interface IPluginOptions {
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

export interface IPluginFactory<T = Record<string, unknown>> {
  type: string
  isFactory: symbol

  (options: IPluginOptions & T): IPlugin
}

export const createFactory: <T>(
  type: string,
  factory: (options: IPluginOptions & T) => IPlugin
) => IPluginFactory<T> = (type, factory) => {
  return Object.assign(factory, { type, isFactory: IS_FACTORY })
}
