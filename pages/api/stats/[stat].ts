import { fetchDataSingle } from 'lib/data'
import { NextApiRequest, NextApiResponse } from 'next'

const stats = async (request: NextApiRequest, resp: NextApiResponse) => {
  const stat = Array.isArray(request.query.stat)
    ? request.query.stat[0]
    : request.query.stat

  const data = await fetchDataSingle(stat)
  if (data === undefined) {
    resp.statusCode = 404
    return resp.end()
  }

  resp.statusCode = 200
  resp.json(data)
}

export default stats
