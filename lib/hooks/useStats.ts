import useSWR, { responseInterface } from 'swr'
import { Except } from 'type-fest'
import { ITransformedData } from '~managers'
import { axios } from '~utils/axios'

export const fetchStats: () => Promise<ITransformedData[]> = async () => {
  const resp = await axios.get<ITransformedData[]>('/api/stats')
  return resp.data
}

type Response = Except<responseInterface<any, any>, 'data'>

/* eslint-disable prettier/prettier */
export function useStats(): Response & { stats: ITransformedData[] | undefined }
export function useStats(initialData: ITransformedData[]): Response & { stats: ITransformedData[] }
export function useStats(initialData?: ITransformedData[]): Response & { stats: ITransformedData[] | undefined } {
  const resp = useSWR('/stats', fetchStats, { initialData, refreshInterval: 1000 * 15 })
  return {...resp, stats: resp.data }
}

/* eslint-enable prettier/prettier */
