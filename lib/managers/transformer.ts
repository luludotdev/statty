import { Status } from '~plugins/types'
import { IManager } from './manager'

export interface ITransformedData {
  id: string
  description: string

  status: Status
  data: Array<[number, number]>
}

export const transformData: (
  manager: IManager
) => ITransformedData = manager => {
  const data = [...manager.data].sort(([a], [b]) => b - a)
  const status = data[0]?.[1].status ?? Status.Unknown

  return {
    id: manager.plugin.id,
    description: manager.plugin.description(),
    status,
    data: data.map(([time, { latency }]) => [time, latency]),
  }
}
