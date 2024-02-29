import { FAKE_NOW } from '@/hooks/useLockHistory'
import { getBoostFunction, LockHistory } from '@/utils/boost'
import { useTheme } from '@mui/material/styles'
import { useCallback, useMemo } from 'react'
import { VictoryAxis, VictoryLabel, VictoryScatter, VictoryArea, VictoryLine } from 'victory'

import { useVictoryTheme } from './theme'

export const GRAPH_HEIGHT = 338
export const GRAPH_PADDING = 24
export const GRAPH_WIDTH = 500

const height = GRAPH_HEIGHT - GRAPH_PADDING * 2
const scaleY = height / 7

const scaleValue = (y: number) => {
  const y1 = GRAPH_PADDING // padding-top
  const y2 = y1 + height
  return y2 - scaleY * y
}

export const BoostGraph = ({ lockedAmount, pastLocks }: { lockedAmount: number; pastLocks: LockHistory[] }) => {
  const theme = useTheme()
  const victoryTheme = useVictoryTheme()

  const now = FAKE_NOW

  const newBoostFunction = useMemo(() => getBoostFunction(now, lockedAmount, pastLocks), [lockedAmount, now, pastLocks])
  const earlyBirdBoostFunction = useMemo(
    () => getBoostFunction(now, lockedAmount, pastLocks, 48),
    [lockedAmount, now, pastLocks],
  )

  const lockBoostFunction = useCallback(
    // Boost at season end - early bird boost
    (d: { x: number }) => newBoostFunction(d) - earlyBirdBoostFunction(d) + 1,
    [newBoostFunction, earlyBirdBoostFunction],
  )

  const currentDotX = now
  const programBegin = 51
  const scaleEnd = 158

  return (
    <svg viewBox={`0 0 ${GRAPH_WIDTH} ${height + 48}`}>
      <defs>
        <linearGradient id="gradient-total" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color={theme.palette.info.main} />
          <stop offset="100%" stop-color={theme.palette.info.main} />
        </linearGradient>
        <linearGradient id="gradient-locked" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color={theme.palette.primary.main} />
          <stop offset="75%" stop-color="#000" />
        </linearGradient>
        <mask id="mask-locked" x="0" y="0" width="100%" height="100%">
          <VictoryArea
            standalone={false}
            name="locked"
            animate
            interpolation="step"
            samples={150}
            style={{ data: { fill: '#FFFFFF' } }}
            domain={{ x: [0, scaleEnd], y: [0, 7] }}
            y={lockBoostFunction}
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

      <g>
        <VictoryAxis
          standalone={false}
          dependentAxis
          domain={{ x: [0, scaleEnd], y: [0, 7] }}
          tickValues={[1, 3, 5, 7]}
          tickFormat={(d) => Number(d).toFixed(0) + 'x'}
          theme={victoryTheme}
        />

        {/* Rect using the total mask */}
        <rect
          x="0"
          y={scaleValue(5)}
          width="100%"
          height={scaleY * 5}
          mask="url(#mask-total)"
          fill="url(#gradient-total)"
        />

        {/* Rect using the locked mask */}
        <rect
          x="0"
          y={scaleValue(3)}
          width="100%"
          height={scaleY * 3}
          mask="url(#mask-locked)"
          fill="url(#gradient-locked)"
        />

        <VictoryLine
          standalone={false}
          name="total-outline"
          animate
          interpolation="step"
          samples={150}
          style={{
            data: { fill: 'none', stroke: theme.palette.info.main, strokeWidth: 1 },
            labels: { color: theme.palette.text.primary, fontFamily: 'DM Sans' },
          }}
          domain={{ x: [0, scaleEnd], y: [0, 7] }}
          y={newBoostFunction}
          theme={victoryTheme}
        />
        <VictoryLine
          standalone={false}
          name="locked-outline"
          animate
          interpolation="step"
          samples={150}
          style={{ data: { fill: 'none', stroke: theme.palette.primary.main, strokeWidth: 1 } }}
          domain={{ x: [0, scaleEnd], y: [0, 7] }}
          y={lockBoostFunction}
          theme={victoryTheme}
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
