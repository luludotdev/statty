import { getInstance } from 'lib/loader'
import { NextApiRequest, NextApiResponse } from 'next'

const instance = async (_: NextApiRequest, resp: NextApiResponse) => {
  const instance = await getInstance()

  resp.statusCode = 200
  resp.send({ name: instance.name })
}

export default instance
