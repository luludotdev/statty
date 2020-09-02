import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { getInstance } from '~loader'

export interface IInstance {
  name: string
}

const handler = nc<NextApiRequest, NextApiResponse>()
handler.get(async (_, resp) => {
  const instance = await getInstance()
  const data: IInstance = {
    name: instance.name,
  }

  resp.statusCode = 200
  resp.send(data)
})

export default handler
