import { FAKE_NOW } from '@/hooks/useLockHistory'
import { getBoostFunction, getEarlyBirdBoostAdvanced, PastLock } from '@/utils/boost'
import { useTheme } from '@mui/material/styles'
import { useMemo } from 'react'
import {
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
  VictoryLabelProps,
  VictoryScatter,
  VictoryArea,
  VictoryLine,
} from 'victory'

import { useVictoryTheme } from './theme'

const scale = 270 / 7

const scaleValue = (y: number) => {
  const y1 = 24 // padding-top
  const height = 270 // height - 48 (padding) see theme.ts
  const y2 = y1 + height
  return y2 - scale * y
}

export const BoostGraph = ({ lockedAmount, pastLocks }: { lockedAmount: number; pastLocks: PastLock[] }) => {
  const theme = useTheme()
  const victoryTheme = useVictoryTheme()

  const now = FAKE_NOW

  const newBoostFunction = useMemo(() => getBoostFunction(now, lockedAmount, pastLocks), [lockedAmount, now, pastLocks])
  const getEarlyBirdFunction = useMemo(
    () => getEarlyBirdBoostAdvanced(now, lockedAmount, pastLocks),
    [lockedAmount, now, pastLocks],
  )

  const currentDotX = now
  const programBegin = 51
  const scaleEnd = 60

  return (
    <svg viewBox="0 0 500 380">
      <defs>
        <linearGradient id="gradient-earlybird" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color={theme.palette.success.main} />
          <stop offset="65%" stop-color="#000" />
        </linearGradient>
        <linearGradient id="gradient-total" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color={theme.palette.info.main} />
          <stop offset="100%" stop-color="#000" />
        </linearGradient>
        <mask id="mask-earlybird" x="0" y="0" width="100%" height="100%">
          <VictoryArea
            standalone={false}
            name="earlyBird"
            animate
            interpolation="step"
            samples={150}
            style={{ data: { fill: '#FFFFFF' } }}
            domain={{ x: [0, scaleEnd], y: [0, 7] }}
            y={(d) => Math.max(getEarlyBirdFunction(d), 1)}
            theme={victoryTheme}
          />
        </mask>
        <mask id="mask-total" x="0" y="0" width="100%" height="100%">
          <VictoryArea
            standalone={false}
            name="total"
            animate
            interpolation="step"
            samples={150}
            style={{ data: { fill: '#FFFFFF' } }}
            domain={{ x: [0, scaleEnd], y: [0, 7] }}
            y={newBoostFunction}
            theme={victoryTheme}
          />
        </mask>
      </defs>

      <g transform={'translate(0, 40)'}>
        <VictoryAxis
          standalone={false}
          dependentAxis
          domain={{ x: [0, scaleEnd], y: [0, 7] }}
          tickValues={[1, 3, 5, 7]}
          tickFormat={(d) => Number(d).toFixed(0) + 'x'}
          theme={victoryTheme}
        />

        <VictoryArea
          standalone={false}
          name="total"
          animate
          interpolation="step"
          samples={150}
          style={{
            data: { fill: theme.palette.info.background, stroke: theme.palette.info.main, strokeWidth: 2 },
            labels: { color: theme.palette.text.primary, fontFamily: 'DM Sans' },
          }}
          domain={{ x: [0, scaleEnd], y: [0, 7] }}
          y={newBoostFunction}
          theme={victoryTheme}
        />

        {/* Rect using the total mask */}
        <rect
          x="0"
          y={scaleValue(7)}
          width="100%"
          height={scale * 7}
          mask="url(#mask-total)"
          fill="url(#gradient-total)"
        />

        {/* Rect using the earlybird mask */}
        <rect
          x="0"
          y={scaleValue(2)}
          width="100%"
          height={scale * 2}
          mask="url(#mask-earlybird)"
          fill="url(#gradient-earlybird)"
        />

        <VictoryScatter
          standalone={false}
          animate
          name="scatter-new"
          style={{
            data: {
              fill: theme.palette.secondary.main,
            },
            labels: {
              verticalAnchor: 'middle',
              fontFamily: 'DM Sans',
              fontSize: 16,
              fill: theme.palette.text.primary,
            },
          }}
          labels={[
            newBoostFunction({ x: currentDotX - 0.0000001 }).toPrecision(2) + 'x',
            newBoostFunction({ x: programBegin }).toPrecision(2) + 'x',
          ]}
          labelComponent={<VictoryLabel dy={16} />}
          size={4}
          domain={{ x: [0, scaleEnd], y: [0, 7] }}
          data={[
            { x: currentDotX, y: newBoostFunction({ x: currentDotX - 0.0000001 }) },
            { x: programBegin, y: newBoostFunction({ x: programBegin }) },
          ]}
          theme={victoryTheme}
        />

        <VictoryAxis
          standalone={false}
          tickValues={[0, now, programBegin]}
          tickFormat={(value) => {
            if (value === 0) {
              return '23/04'
            }

            if (value === now) {
              return 'now'
            }

            return '10/06'
          }}
          domain={{ x: [0, scaleEnd], y: [0, 7] }}
          style={{
            grid: { stroke: theme.palette.text.disabled, strokeDasharray: 3, strokeDashoffset: 3 },
            ticks: { size: 5 },
            tickLabels: { fontSize: 15, padding: 0 },
          }}
          theme={victoryTheme}
        />
      </g>
    </svg>
  )
}
