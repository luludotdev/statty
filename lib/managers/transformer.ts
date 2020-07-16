import { Status } from '~plugins/base'
import { IManager } from './manager'

interface ITransformedData {
  id: string
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
    status,
    data: data.map(([time, { latency }]) => [time, latency]),
  }
}
