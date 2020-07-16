import { GetServerSideProps, NextPage } from 'next'
import type { IInstance } from '~api/instance'
import { Meta } from '~components/Meta'
import { Service } from '~components/Service'
import { Incidents } from '~components/Status'
import { fetchStats, useStats } from '~hooks/useStats'
import { ITransformedData } from '~managers'
import { axios } from '~utils/axios'

import '~styles/page.styl'

interface IProps {
  siteName: string
  initialData: ITransformedData[]
}

const App: NextPage<IProps> = ({ siteName, initialData }) => {
  const { stats } = useStats(initialData)

  return (
    <>
      <Meta siteName={siteName} />

      <div className='page'>
        <h1>{siteName}</h1>
        <Incidents stats={stats} />

        {stats.map(x => (
          <Service key={x.id} {...x} />
        ))}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<IProps> = async () => {
  const [resp, initialData] = await Promise.all([
    axios.get<IInstance>('/api/instance'),
    fetchStats(),
  ])

  return { props: { siteName: resp.data.name, initialData } }
}

export default App
