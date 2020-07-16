import Ajv from 'ajv'
import { readFileSync } from 'fs'
import { IConfig } from './types'

const schemaData = readFileSync('./assets/config.schema.json', 'utf-8')
const schema = JSON.parse(schemaData)

const ajv = new Ajv()
const validate = ajv.compile(schema)

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
