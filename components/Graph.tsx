import ms from 'ms'
import { FunctionComponent, useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMediaQuery } from '~hooks/useMediaQuery'
import { ITransformedData } from '~managers'

import '~styles/graph.styl'

interface IProps {
  limit: ITransformedData['limit']
  data: ITransformedData['data']
}

export const Graph: FunctionComponent<IProps> = ({ data, limit }) => {
  const isSmallScreen = useMediaQuery('(max-width: 500px)')

  const transformed = useMemo(() => {
    return data.map(([timestamp, latency]) => ({ timestamp, latency }))
  }, [data])

  if (transformed.length === 0) {
    return <div className='graph-placeholder' />
  }

  const now = Date.now()
  const formatXTick = (timestamp: number) => {
    const delta = now - timestamp
    if (delta < 100) {
      return 'now'
    }

    return ms(delta)
  }

  const tick = { fill: 'currentColor', opacity: 0.75 }

  return (
    <div className='graph-container'>
      <ResponsiveContainer width='100%' height={175}>
        <AreaChart data={transformed}>
          <XAxis
            dataKey='timestamp'
            tickFormatter={formatXTick}
            tickLine={false}
            axisLine={false}
            tick={tick}
            type='number'
            domain={['dataMin', 'dataMax']}
          />

          {isSmallScreen ? null : (
            <YAxis
              dataKey='latency'
              tickLine={false}
              tickFormatter={tick => (tick === 0 ? '' : ms(tick))}
              tick={tick}
              axisLine={false}
              type='number'
            />
          )}

          <CartesianGrid
            strokeDasharray='3 3'
            stroke='currentColor'
            opacity='0.25'
          />

          <Tooltip
            isAnimationActive={false}
            formatter={v => {
              const value = Array.isArray(v) ? v[0] : v
              const string: string = value.toString()
              return `${string}ms`
            }}
            label='DAB'
            separator=': '
            labelFormatter={v => {
              const time = typeof v === 'number' ? v : Number.parseInt(v, 10)
              return `${ms(now - time)} ago`
            }}
          />

          <ReferenceLine
            y={limit}
            label={<Label fill='currentColor'>{ms(limit)}</Label>}
            stroke='red'
          />

          <Area
            type='monotone'
            dataKey='latency'
            isAnimationActive={false}
            fill='hsl(200, 100%, 85%)'
            stroke='hsl(200, 100%, 55%)'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
