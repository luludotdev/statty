import { getManagers } from '~loader'
import { transformData } from '~managers'
import type { TransformedData } from '~managers'

export const fetchData: () => Promise<TransformedData[]> = async () => {
  const managers = await getManagers()
  return [...managers.values()].map(x => transformData(x))
}

export const fetchDataSingle: (
  manager: string
) => Promise<TransformedData | undefined> = async name => {
  const managers = await getManagers()
  const manager = managers.get(name)

  if (manager === undefined) return undefined
  return transformData(manager)
}
