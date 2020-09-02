import { fetchData } from 'lib/data'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const handler = nc<NextApiRequest, NextApiResponse>()
handler.get(async (_, resp) => {
  const data = await fetchData()

  resp.statusCode = 200
  resp.send(data)
})

export default handler
