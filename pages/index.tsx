import { GetServerSideProps, NextPage } from 'next'
import type { IInstance } from '~api/instance'
import { Meta } from '~components/Meta'
import { fetchStats, useStats } from '~hooks/useStats'
import { ITransformedData } from '~managers'
import { axios } from '~utils/axios'

interface IProps {
  siteName: string
  initialData: ITransformedData[]
}

const App: NextPage<IProps> = ({ siteName, initialData }) => {
  const { stats } = useStats(initialData)

  return (
    <>
      <Meta siteName={siteName} />
      <pre>{JSON.stringify(stats, null, 2)}</pre>
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
