import { promises as fs } from 'fs'
import { join, parse } from 'path'
import yaml from 'yaml'
import { CONFIG_PATH } from '~env'
import { exists } from '~utils/fs'

type ParserFn = (string: string) => any

const resolvePath: () => Promise<[string, ParserFn] | undefined> = async () => {
  const extensions: Array<[string, ParserFn]> = [
    ['yaml', yaml.parse],
    ['yml', yaml.parse],
    ['json', JSON.parse],
  ]

  const envExists = CONFIG_PATH && (await exists(CONFIG_PATH))
  if (envExists) {
    const configPath = CONFIG_PATH as string
    const ext = parse(configPath).ext.slice(1)

    const firstExt = extensions.find(([extension]) => extension === ext)
    if (firstExt === undefined) return undefined

    return [configPath, firstExt[1]]
  }

  const base = (CONFIG_PATH && parse(CONFIG_PATH).base) ?? './'
  const checks = extensions
    .map(([ext, fn]) => ({
      name: `config.${ext.toLowerCase()}`,
      fn,
    }))
    .map(({ name, fn }) => ({ name: join(base, name), fn }))
    .map(async ({ name, fn }) => ({ name, fn, exists: await exists(name) }))

  const paths = await Promise.all(checks)
  const first = paths.find(({ exists }) => exists === true)

  if (first === undefined) return undefined
  return [first.name, first.fn]
}

export const readConfig: () => Promise<unknown> = async () => {
  const resolved = await resolvePath()

  if (resolved === undefined) {
    throw new Error('Cannot read config file!')
  }

  const [path, parser] = resolved
  const data = await fs.readFile(path, 'utf-8')

  return parser(data)
}
