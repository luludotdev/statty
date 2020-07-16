import { sync as readPkg } from 'read-pkg-up'

const pkg = readPkg()
export const name = pkg?.packageJson.name ?? 'statty'
export const version = pkg?.packageJson.version ?? 'dev'
