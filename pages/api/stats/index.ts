import { fetchData } from 'lib/data'
import { NextApiRequest, NextApiResponse } from 'next'

const stats = async (_: NextApiRequest, resp: NextApiResponse) => {
  const data = await fetchData()

  resp.statusCode = 200
  resp.send(data)
}

export default stats
