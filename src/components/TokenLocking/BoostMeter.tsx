import { SEASON2_START } from '@/config/constants'
import { floorNumber, getTimeFactor } from '@/utils/boost'
import { getCurrentDays } from '@/utils/date'
import { AccessTime } from '@mui/icons-material'
import { Box, LinearProgress, Stack, Tooltip, Typography } from '@mui/material'
import { ReactElement, useMemo } from 'react'

import { useTheme } from '@mui/material/styles'
import { useStartDate } from '@/hooks/useStartDates'

export const BoostMeter = ({
  isLock,
  isVisibleDifference,
  prediction,
}: {
  isLock: boolean
  isVisibleDifference: boolean
  prediction?: number
}) => {
  const { startTime } = useStartDate()

  const now = useMemo(() => getCurrentDays(startTime), [startTime])

  const currentTimeFactor = getTimeFactor(now)
  const maxTimeFactor = getTimeFactor(0)
  const minTimeFactor = getTimeFactor(SEASON2_START)

  // Boost meter values are between 10 and 90
  const value = ((currentTimeFactor - minTimeFactor) / (maxTimeFactor - minTimeFactor)) * 100

  let boostMeterInfo: ReactElement | null = null

  const theme = useTheme()

  if (isLock) {
    if (isVisibleDifference && prediction) {
      boostMeterInfo = (
        <Typography>
          If you lock in 10 days your boost will only be{' '}
          <b style={{ color: theme.palette.warning.main }}>{floorNumber(prediction, 2)}x</b>
        </Typography>
      )
    } else {
      boostMeterInfo =
        value > 25 ? (
          <Typography color="text.secondary">The earlier you lock the higher the boost.</Typography>
        ) : (
          <Typography color="text.secondary">Your last chance to get the early boost.</Typography>
        )
    }
  } else {
    boostMeterInfo = <Typography>You will stop accruing boost for unlocked SAFE.</Typography>
  }

  return (
    <Stack direction="row" spacing={2} height="100%" alignItems="flex-end">
      <LinearProgress
        variant="determinate"
        value={value}
        color={value > 50 ? 'primary' : 'warning'}
        sx={{
          height: '100%',
          border: ({ palette }) => `4px solid ${palette.border.light}`,
          padding: '2px',
          borderRadius: '8px',
          backgroundColor: ({ palette }) => palette.border.main,
          '& .MuiLinearProgress-bar': {
            borderRadius: '6px',
            transform: () => {
              return `translateY(${100 - value}%) !important`
            },
          },
        }}
      />
      <Box>
        <Tooltip
          title={
            value > 50
              ? 'Receive a bonus for early locking. Boost meter is going down over time.'
              : 'Receive a bonus for early locking. Realise your last chance to get an early boost.'
          }
        >
          <AccessTime fontSize="small" />
        </Tooltip>
        <Typography variant="subtitle2" my={1} fontWeight={700}>
          Early boost meter
        </Typography>
        {boostMeterInfo}
      </Box>
    </Stack>
  )
}
