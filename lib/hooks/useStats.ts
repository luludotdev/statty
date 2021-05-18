import useSWR, { responseInterface } from 'swr'
import type { TransformedData } from '~managers'
import { axios } from '~utils/axios'
import type { IncomingMessage } from 'http'
import type { Except } from 'type-fest'

export const fetchStats: (
  request?: IncomingMessage
) => Promise<TransformedData[]> = async request => {
  const resp = await axios.get<TransformedData[]>('/api/stats', {
    _req: request,
  })

  return resp.data
}

type Response = Except<responseInterface<any, any>, 'data'>

/* eslint-disable prettier/prettier */
/* eslint-disable no-redeclare */
export function useStats(): Response & { stats: TransformedData[] | undefined }
export function useStats(initialData: TransformedData[]): Response & { stats: TransformedData[] }
export function useStats(initialData?: TransformedData[]): Response & { stats: TransformedData[] | undefined } {
  const resp = useSWR('/stats', fetchStats, { initialData, refreshInterval: 1000 * 15 })
  return {...resp, stats: resp.data }
}
/* eslint-enable prettier/prettier */
/* eslint-enable no-redeclare */
