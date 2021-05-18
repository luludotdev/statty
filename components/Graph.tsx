import ms from 'ms'
import { FC, useMemo } from 'react'
import * as Recharts from 'recharts'
import { useMediaQuery } from '~hooks/useMediaQuery'
import { TransformedData } from '~managers'

const {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} = Recharts

interface Props {
  limit: TransformedData['limit']
  data: TransformedData['data']
}

export const Graph: FC<Props> = ({ data, limit }) => {
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
      <style jsx>
        {`
          .graph-container
            width 100%

          .graph-placeholder
            width 100%
            height 175px
            border-radius 0.25rem

            background-color rgb(205, 205, 205)
            animation placeholder-pulse 1.5s infinite

          @keyframes placeholder-pulse
            0%
              opacity .6
            50%
              opacity 1
            100%
              opacity .6
        `}
      </style>

      <style jsx global>
        {`
          .recharts-cartesian-axis-tick-value
            font-size 0.85em

          .recharts-tooltip-item
            padding 0 !important

          .recharts-tooltip-wrapper
            color inherit

          .recharts-tooltip-wrapper .recharts-default-tooltip
            border none !important
            padding 0.5em !important
            border-radius 0.2rem
            font-size 0.85em
            opacity 0.75
            line-height 1.25
            background-color white

            & li
              color inherit !important
        `}
      </style>

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
              tickFormatter={(tick: number) => (tick === 0 ? '' : ms(tick))}
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
            formatter={(v: any) => {
              const value = Array.isArray(v) ? v[0] : v
              const string: string = value.toString()
              return `${string}ms`
            }}
            label='DAB'
            separator=': '
            labelFormatter={(v: string | number) => {
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
