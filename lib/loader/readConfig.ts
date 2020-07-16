import { promises as fs } from 'fs'
import yaml from 'yaml'
import { exists } from '~utils/fs'

const YAML_PATH = './config.yaml'
const YML_PATH = './config.yml'
const JSON_PATH = './config.json'

export const readConfig: () => Promise<unknown> = async () => {
  const [yamlExists, ymlExists, jsonExists] = await Promise.all([
    exists(YAML_PATH),
    exists(YML_PATH),
    exists(JSON_PATH),
  ])

  const path = yamlExists
    ? YAML_PATH
    : ymlExists
    ? YML_PATH
    : jsonExists
    ? JSON_PATH
    : undefined

  if (path === undefined) {
    throw new Error('Cannot read config file!')
  }

  const data = await fs.readFile(path, 'utf-8')
  const object: unknown = jsonExists ? JSON.parse(data) : yaml.parse(data)

  return object
}
