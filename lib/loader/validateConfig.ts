import Ajv from 'ajv'
import { readFileSync } from 'fs'

const schemaData = readFileSync('./assets/config.schema.json', 'utf-8')
const schema = JSON.parse(schemaData)

const ajv = new Ajv()
const validate = ajv.compile(schema)

interface IConfig {
  instance: IInstance
  services: IService[]
}

export interface IInstance {
  name: string
}

export interface IService {
  [key: string]: unknown

  id: string
  plugin: string
  target: string

  description?: string
  latencyLimit?: number
}

// @ts-expect-error
const isValid: (object: any) => object is IConfig = object => {
  const valid = validate(object)
  return valid
}

export const validateConfig: (object: any) => IConfig = object => {
  const error = new Error('Invalid config!')
  if (typeof object !== 'object') throw error
  if (object === null) throw error

  const valid = isValid(object)
  if (valid === false) throw error

  delete object.$schema
  return object
}
