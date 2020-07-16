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
