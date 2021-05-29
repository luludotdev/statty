import { GetServerSideProps, NextPage } from 'next'
import type { Instance } from '~api/instance'
import { AppMeta } from '~components/AppMeta'
import { Favicon } from '~components/Favicon'
import { Footer } from '~components/Footer'
import { Service } from '~components/Service'
import { Incidents } from '~components/Status'
import { fetchStats, useStats } from '~hooks/useStats'
import { TransformedData } from '~managers'
import { axios } from '~utils/axios'

interface Props {
  siteName: string
  initialData: TransformedData[]
}

const App: NextPage<Props> = ({ siteName, initialData }) => {
  const { stats } = useStats(initialData)

  return (
    <>
      <style jsx>{`
        .page
          max-width 40em
          margin 0 auto

          & h1:first-child
            margin-top 0
      `}</style>

      <Favicon stats={stats} />
      <AppMeta siteName={siteName} stats={stats} />

      <div className='page'>
        <h1>{siteName}</h1>
        <Incidents stats={stats} />

        {stats.map(x => (
          <Service key={x.id} {...x} />
        ))}

        <Footer />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const [resp, initialData] = await Promise.all([
    axios.get<Instance>('/api/instance', { _req: req }),
    fetchStats(req),
  ])

  return { props: { siteName: resp.data.name, initialData } }
}

export default App
