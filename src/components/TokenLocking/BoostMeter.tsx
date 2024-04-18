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
  const value = currentTimeFactor * 100

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
    boostMeterInfo = (
      <Typography color="text.secondary">You will stop getting the boost for unlocked tokens.</Typography>
    )
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
            value < 100
              ? 'Receive a bonus for early locking. Realise your last chance to get an early boost.'
              : 'Receive a bonus for early locking. After May 20 the boost will decrease.'
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
