import { floorNumber } from '@/utils/boost'
import { SignalCellularAlt, SignalCellularAlt1Bar, SignalCellularAlt2Bar } from '@mui/icons-material'
import { Stack, Typography, Box } from '@mui/material'
import BoostCounter from '../BoostCounter'
import { BoostMeter } from './BoostMeter'

import css from './styles.module.css'

const BoostStrengthSignal = ({ boost, color }: { boost: number; color: 'primary' | 'warning' | undefined }) => {
  const strength = Math.floor(boost / 1.25)

  if (strength === 0) {
    return null
  }

  const iconProps = {
    fontSize: 'large',
    color,
    sx: {
      position: 'relative',
      left: -35,
    },
  } as const

  if (strength === 1) {
    return <SignalCellularAlt1Bar {...iconProps} />
  }
  if (strength === 2) {
    return <SignalCellularAlt2Bar {...iconProps} />
  }
  return <SignalCellularAlt {...iconProps} />
}

export const BoostBreakdown = ({
  realizedBoost,
  currentFinalBoost,
  newFinalBoost,
  isLock,
}: {
  realizedBoost: number
  currentFinalBoost: number
  newFinalBoost: number
  isLock: boolean
}) => {
  const isVisibleDifference = Math.abs(floorNumber(currentFinalBoost, 2) - floorNumber(newFinalBoost, 2))

  return (
    <Stack gap={2} height="100%">
      <Box className={`${css.boostInfoBox} ${css.bordered}`} p={3} gap={4} height="100%" display="flex">
        <Stack direction="row" justifyContent="space-between" width="100%" height="100%" alignItems="start">
          <span>
            <SignalCellularAlt color="border" fontSize="large" />
            <BoostStrengthSignal
              boost={newFinalBoost}
              color={isVisibleDifference ? (isLock ? 'primary' : 'warning') : undefined}
            />
          </span>
          <Typography variant="body2" color="text.secondary">
            Realized boost {floorNumber(realizedBoost, 2)}x
          </Typography>
        </Stack>

        <Stack direction="column" width="100%" alignItems="start" mt={8} spacing={1}>
          <BoostCounter
            value={newFinalBoost}
            variant="h2"
            fontWeight={700}
            color={isVisibleDifference ? (isLock ? 'primary' : 'warning.main') : undefined}
            direction={isVisibleDifference ? (isLock ? 'north' : 'south') : undefined}
          />
          <Typography variant="body2" color="text.secondary">
            Expected final point boost
          </Typography>
        </Stack>
      </Box>
      <Box className={`${css.boostInfoBox} ${css.bordered}`} p={2} gap={4} display="flex" width="100%">
        <Box height="88px">
          <BoostMeter />
        </Box>
      </Box>
    </Stack>
  )
}
