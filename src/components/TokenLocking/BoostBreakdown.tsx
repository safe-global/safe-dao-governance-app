import { floorNumber } from '@/utils/boost'
import { SignalCellularAlt, SignalCellularAlt1Bar, SignalCellularAlt2Bar } from '@mui/icons-material'
import { Stack, Typography, Box } from '@mui/material'
import NumberCounter from '../BoostCounter'
import { BoostMeter } from './BoostMeter'

import EmptyBreakdown from '@/public/images/empty-breakdown.svg'

import css from './styles.module.css'

const BoostStrengthSignal = ({ boost, color }: { boost: number; color: 'primary' | 'warning' | undefined }) => {
  const strength = Math.floor((boost - 1) / 0.25)

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
  boostPrediction,
  isLock,
}: {
  realizedBoost: number
  currentFinalBoost: number
  newFinalBoost: number
  boostPrediction?: number
  isLock: boolean
}) => {
  const isVisibleDifference = Math.abs(floorNumber(currentFinalBoost, 2) - floorNumber(newFinalBoost, 2)) > 0

  // If everything is 1.0 there are no relevant locks / no amount is put in
  const isInitialState = realizedBoost === 1 && currentFinalBoost === 1 && newFinalBoost === 1

  return (
    <Stack direction={{ md: 'column' }} gap={2} height="100%">
      <Box className={`${css.boostInfoBox} ${css.bordered}`} p={3} gap={4} flex="2" height="100%" display="flex">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          textAlign="right"
        >
          <span style={{ display: 'inline-flex' }}>
            {!isInitialState && (
              <>
                <SignalCellularAlt color="border" fontSize="large" />
                <BoostStrengthSignal
                  boost={newFinalBoost}
                  color={isVisibleDifference ? (isLock ? 'primary' : 'warning') : undefined}
                />
              </>
            )}
          </span>
          <Typography color="text.secondary">Current boost: {floorNumber(currentFinalBoost, 2)}x</Typography>
        </Box>

        {isInitialState ? (
          <Stack mt={4} spacing={4}>
            <EmptyBreakdown />
            <Typography variant="body2" color="text.secondary">
              Start locking tokens to get your points boost.
            </Typography>
          </Stack>
        ) : (
          <Stack direction="column" width="100%" alignItems="start" mt="auto" spacing={2}>
            <NumberCounter
              value={newFinalBoost}
              variant="h2"
              fontWeight={700}
              color={isVisibleDifference ? (isLock ? 'primary' : 'warning.main') : undefined}
              direction={isVisibleDifference ? (isLock ? 'north' : 'south') : undefined}
            />
            <Typography variant="body2" color="text.secondary">
              Your boost
            </Typography>
          </Stack>
        )}
      </Box>
      <Box className={`${css.boostInfoBox} ${css.bordered}`} flex="0" p={3} gap={4} display="flex" width="100%">
        <Box>
          <BoostMeter isLock={isLock} isVisibleDifference={isVisibleDifference} prediction={boostPrediction} />
        </Box>
      </Box>
    </Stack>
  )
}
