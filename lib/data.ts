import { ITransformedData, transformData } from '~managers'
import { getManagers } from './loader'

export const fetchData: () => Promise<ITransformedData[]> = async () => {
  const managers = await getManagers()
  return [...managers.values()].map(x => transformData(x))
}
