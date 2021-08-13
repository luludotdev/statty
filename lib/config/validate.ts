import Ajv from 'ajv'
import type { ErrorObject } from 'ajv'
import addFormats from 'ajv-formats'
import { readFileSync } from 'fs'
import type { Config } from './types'

const schemaData = readFileSync('./assets/config.schema.json', 'utf-8')
const schema = JSON.parse(schemaData) as Record<string, unknown>

const ajv = new Ajv()
addFormats(ajv)
const validate = ajv.compile(schema)

// @ts-expect-error Type Assertion
const isValid: (object: unknown) => object is Config = object => {
  const valid = validate(object)
  return valid
}

class ValidationError extends Error {
  public readonly errors: ErrorObject[] | null | undefined

  constructor(errors: ErrorObject[] | null | undefined) {
    super('Invalid config!')
    this.errors = errors
  }
}

export const validateConfig: (object: unknown) => Config = object => {
  const error = new Error('Invalid config!')
  if (typeof object !== 'object') throw error
  if (object === null) throw error

  if (isValid(object)) {
    // @ts-expect-error Schema key is untyped
    delete object.$schema
    return object
  }

  throw new ValidationError(validate.errors)
}
