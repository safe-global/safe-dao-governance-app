import { CHAIN_START_TIMESTAMPS } from '@/config/constants'
import { useChainId } from '@/hooks/useChainId'
import { floorNumber } from '@/utils/boost'
import { getCurrentDays } from '@/utils/date'
import { AccessTime } from '@mui/icons-material'
import { Box, LinearProgress, Stack, Tooltip, Typography } from '@mui/material'
import { ReactElement, useMemo } from 'react'
import { SEASON2_START } from './BoostGraph/graphConstants'

import { useTheme } from '@mui/material/styles'

export const BoostMeter = ({
  isLock,
  isVisibleDifference,
  prediction,
}: {
  isLock: boolean
  isVisibleDifference: boolean
  prediction?: number
}) => {
  const chainId = useChainId()
  const startTime = CHAIN_START_TIMESTAMPS[chainId]
  const now = useMemo(() => getCurrentDays(startTime), [startTime])

  const value = ((SEASON2_START - now) / SEASON2_START) * 100

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
          <Typography>The earlier you lock the higher the boost.</Typography>
        ) : (
          <Typography>Your last chance to get the early boost.</Typography>
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
            value < 25
              ? 'Receive a bonus for locking early. Realise your last chance to get an early boost.'
              : 'Receive a bonus for locking early. The boost meter is going down over time.'
          }
        >
          <AccessTime fontSize="small" />
        </Tooltip>
        <Typography variant="subtitle2" fontWeight={700}>
          Early boost meter
        </Typography>
        {boostMeterInfo}
      </Box>
    </Stack>
  )
}
