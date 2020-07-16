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

interface IPluginReponse {
  /**
   * Latency to target (in millis)
   */
  latency: number

  /**
   * Target Status
   */
  status: Status
}

interface IPlugin {
  type: string
  target: string

  run: () => IPluginReponse | Promise<IPluginReponse>
}

export interface IPluginOptions {
  /**
   * Plugin target
   */
  target: string

  /**
   * Limit for acceptable latency (in millis)
   *
   * Defaults to 1000ms
   */
  latencyLimit?: number
}

export const DEFAULT_LATENCY_LIMIT = 1000

export type PluginFactory<T = Record<string, unknown>> = (
  options: IPluginOptions & T
) => IPlugin
