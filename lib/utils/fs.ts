import { constants, promises as fs, PathLike } from 'fs'

export const exists = async (path: PathLike) => {
  try {
    await fs.access(path, constants.F_OK)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}
