import { CHAIN_START_TIMESTAMPS, SEASON1_START, SEASON2_START } from '@/config/constants'
import { useChainId } from '@/hooks/useChainId'
import { floorNumber, getBoostFunction } from '@/utils/boost'
import { getCurrentDays } from '@/utils/date'
import { formatAmount } from '@/utils/formatters'
import { LockHistory } from '@/utils/lock'
import { useTheme } from '@mui/material/styles'
import { useMemo } from 'react'
import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, DomainTuple, ForAxes, VictoryArea } from 'victory'
import { ArrowDownLabel } from './ArrowDownLabel'
import { AxisTopLabel } from './AxisTopLabel'
import { BoostGradients } from './BoostGradients'
import { generatePointsFromHistory } from './helper'
import { ScatterDot } from './ScatterDot'

import { useVictoryTheme } from './theme'
import { useStartDate } from '@/hooks/useStartDates'

const DOMAIN: ForAxes<DomainTuple> = { x: [-5, SEASON2_START + 5], y: [0.8, 2.2] }

export const BoostGraph = ({
  lockedAmount,
  pastLocks,
  isLock,
}: {
  lockedAmount: number
  pastLocks: LockHistory[]
  isLock: boolean
}) => {
  const theme = useTheme()
  const victoryTheme = useVictoryTheme()
  const { startTime } = useStartDate()

  const now = useMemo(() => getCurrentDays(startTime), [startTime])

  const currentBoostFunction = useMemo(() => getBoostFunction(now, 0, pastLocks), [now, pastLocks])
  const newBoostFunction = useMemo(() => getBoostFunction(now, lockedAmount, pastLocks), [lockedAmount, now, pastLocks])

  const pastLockPoints = useMemo(() => generatePointsFromHistory(pastLocks, now), [pastLocks, now])

  console.log(pastLockPoints)

  const format = (value: number) => formatAmount(floorNumber(value, 2), 2)

  const currentBoostDataPoints = useMemo(
    () => [
      ...pastLockPoints,
      { x: 0, y: currentBoostFunction({ x: 0 }) },
      { x: now, y: currentBoostFunction({ x: now }) },
      { x: SEASON1_START, y: currentBoostFunction({ x: SEASON1_START }) },
      { x: SEASON2_START, y: currentBoostFunction({ x: SEASON2_START }) },
    ],
    [currentBoostFunction, now, pastLockPoints],
  )

  const projectedBoostDataPoints = useMemo(
    () => [
      ...pastLockPoints,
      { x: 0, y: newBoostFunction({ x: 0 }) },
      { x: now, y: newBoostFunction({ x: now }) },
      { x: SEASON1_START, y: newBoostFunction({ x: SEASON1_START }) },
      { x: SEASON2_START, y: newBoostFunction({ x: SEASON2_START }) },
    ],
    [newBoostFunction, now, pastLockPoints],
  )

  return (
    <div>
      <BoostGradients />
      <VictoryChart theme={victoryTheme}>
        <VictoryArea
          interpolation="stepAfter"
          animate
          domain={DOMAIN}
          style={{
            data: {
              fill: isLock ? 'url(#gain)' : 'url(#loss)',
              strokeWidth: 2,
            },
          }}
          data={isLock ? projectedBoostDataPoints : currentBoostDataPoints}
        />

        <VictoryArea
          interpolation="stepAfter"
          domain={DOMAIN}
          style={{
            data: {
              fill: theme.palette.background.paper,
              strokeWidth: 2,
            },
          }}
          data={
            isLock
              ? [
                  { x: 0, y: 1 },
                  { x: SEASON2_START, y: 1 },
                ]
              : projectedBoostDataPoints
          }
        />

        <VictoryLine
          interpolation="stepAfter"
          animate
          style={{
            data: {
              stroke: isLock
                ? lockedAmount === 0 && pastLocks.length === 0
                  ? theme.palette.border.light
                  : 'url(#gradient)'
                : lockedAmount === 0
                ? 'url(#gradient)'
                : theme.palette.warning.light,
              strokeWidth: 3,
            },
          }}
          data={projectedBoostDataPoints}
        />

        <VictoryAxis
          dependentAxis
          domain={DOMAIN}
          tickValues={[1, 1.5, 2]}
          tickFormat={(d) => Number(d).toFixed(1) + 'x'}
          theme={victoryTheme}
          style={{
            tickLabels: {
              padding: 16,
            },
          }}
        />
        <VictoryAxis
          orientation="top"
          tickValues={[0, SEASON1_START, SEASON2_START]}
          tickFormat={(value) => {
            if (value === 0) {
              return 'Program start'
            }
            if (value === SEASON1_START) {
              return 'Season 1'
            }

            return 'Season 1 end'
          }}
          domain={DOMAIN}
          style={{
            grid: { stroke: theme.palette.primary.light, strokeDasharray: 2, strokeDashoffset: 2 },
            ticks: { size: 5 },
            tickLabels: { fontSize: 12, padding: 16, fill: theme.palette.primary.light },
          }}
          tickLabelComponent={<AxisTopLabel startTime={startTime} />}
          theme={victoryTheme}
        />
        <VictoryAxis
          tickValues={[now]}
          tickFormat={(value) => {
            if (value === now) {
              return 'Today'
            }
            return ''
          }}
          domain={DOMAIN}
          style={{
            grid: { stroke: theme.palette.text.primary, strokeDasharray: 2, strokeDashoffset: 2 },
            ticks: { size: 5 },
            tickLabels: { fontSize: 12, padding: 0, fill: theme.palette.text.primary },
          }}
          theme={victoryTheme}
        />

        <VictoryScatter
          name="scatter-points"
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
          size={4}
          dataComponent={
            <ScatterDot
              today={now}
              backgroundColor={isLock ? theme.palette.primary.main : theme.palette.warning.main}
            />
          }
          domain={DOMAIN}
          data={pastLockPoints}
          theme={victoryTheme}
        />
        <VictoryScatter
          animate
          name="scatter-today-future"
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
          labels={[format(newBoostFunction({ x: now })) + 'x', format(newBoostFunction({ x: SEASON2_START })) + 'x']}
          labelComponent={
            <ArrowDownLabel backgroundColor={isLock ? theme.palette.primary.main : theme.palette.warning.main} />
          }
          size={4}
          dataComponent={
            <ScatterDot
              today={now}
              backgroundColor={isLock ? theme.palette.primary.main : theme.palette.warning.main}
            />
          }
          domain={DOMAIN}
          data={[
            { x: now, y: newBoostFunction({ x: now }) },
            { x: SEASON2_START, y: newBoostFunction({ x: SEASON2_START }) },
          ]}
          theme={victoryTheme}
        />
      </VictoryChart>
    </div>
  )
}
