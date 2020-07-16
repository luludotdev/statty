import { NextApiRequest, NextApiResponse } from 'next'
import { getInstance } from '~loader'

export interface IInstance {
  name: string
}

const instance = async (_: NextApiRequest, resp: NextApiResponse) => {
  const instance = await getInstance()
  const data: IInstance = {
    name: instance.name,
  }

  resp.statusCode = 200
  resp.send(data)
}

export default instance
