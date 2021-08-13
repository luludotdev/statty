import { constants, promises as fs, PathLike } from 'fs'

interface FSError extends Error {
  errno: number
  syscall: string
  code: string
}

// @ts-expect-error Type Assertion
const isFsError: (error: Error) => error is FSError = error =>
  'errno' in error && 'syscall' in error && 'code' in error

export const exists = async (path: PathLike) => {
  try {
    await fs.access(path, constants.F_OK)
    return true
  } catch (error: unknown) {
    if (error instanceof Error && isFsError(error) && error.code === 'ENOENT') {
      return false
    }

    throw error
  }
}
