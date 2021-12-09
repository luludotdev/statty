import type { IncomingMessage } from 'http'
import useSWR from 'swr'
import type { SWRResponse } from 'swr'
import type { Except } from 'type-fest'
import type { TransformedData } from '~managers'
import { axios } from '~utils/axios'

export const fetchStats: (
  request?: IncomingMessage
) => Promise<TransformedData[]> = async request => {
  const resp = await axios.get<TransformedData[]>('/api/stats', {
    _req: request,
  })

  return resp.data
}

type Response = Except<SWRResponse, 'data'>

/* eslint-disable prettier/prettier */
export function useStats(): Response & { stats: TransformedData[] | undefined }
export function useStats(initialData: TransformedData[]): Response & { stats: TransformedData[] }
export function useStats(initialData?: TransformedData[]): Response & { stats: TransformedData[] | undefined } {
  const resp = useSWR('/stats', fetchStats, { initialData, refreshInterval: 1000 * 15 })
  return {...resp, stats: resp.data }
}
/* eslint-enable prettier/prettier */
