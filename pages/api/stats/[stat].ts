import { fetchDataSingle } from 'lib/data'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const handler = nc<NextApiRequest, NextApiResponse>()
handler.get(async (request, resp) => {
  const stat = Array.isArray(request.query.stat)
    ? request.query.stat[0]
    : request.query.stat

  const data = await fetchDataSingle(stat)
  if (data === undefined) {
    resp.statusCode = 404
    resp.end()

    return
  }

  resp.statusCode = 200
  resp.json(data)
})

export default handler
