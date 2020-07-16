import { ITransformedData, transformData } from '~managers'
import { getManagers } from './loader'

export const fetchData: () => Promise<ITransformedData[]> = async () => {
  const managers = await getManagers()
  return [...managers.values()].map(x => transformData(x))
}

export const fetchDataSingle: (
  manager: string
) => Promise<ITransformedData | undefined> = async name => {
  const managers = await getManagers()
  const manager = managers.get(name)

  if (manager === undefined) return undefined
  return transformData(manager)
}
