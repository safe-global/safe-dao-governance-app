import { floorNumber } from '@/utils/boost'
import { SignalCellularAlt, SignalCellularAlt1Bar, SignalCellularAlt2Bar } from '@mui/icons-material'
import { Stack, Typography, Box } from '@mui/material'
import BoostCounter from '../BoostCounter'
import { BoostMeter } from './BoostMeter'

import css from './styles.module.css'

const mapBoostToSignalStrength = (boost: number) => {
  const strength = Math.floor(boost / 1.25)

  if (strength === 0) {
    return null
  }

  const iconProps = {
    fontSize: 'large',
    color: 'primary',
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

export const BoostBreakdown = ({ realizedBoost, finalBoost }: { realizedBoost: number; finalBoost: number }) => {
  return (
    <Stack gap={2} height="100%">
      <Box className={`${css.boostInfoBox} ${css.bordered}`} p={3} gap={4} height="100%" display="flex">
        <Stack direction="row" justifyContent="space-between" width="100%" height="100%" alignItems="start">
          <span>
            <SignalCellularAlt color="border" fontSize="large" />
            {mapBoostToSignalStrength(finalBoost)}
          </span>
          <Typography variant="body2" color="text.secondary">
            Realized boost {floorNumber(realizedBoost, 2)}x
          </Typography>
        </Stack>

        <Stack direction="column" width="100%" alignItems="start" mt={8} spacing={1}>
          <BoostCounter value={finalBoost} variant="h2" fontWeight={700} color="primary" />
          <Typography variant="body2" color="text.secondary">
            Expected final point boost
          </Typography>
        </Stack>
      </Box>
      <Box className={`${css.boostInfoBox} ${css.bordered}`} p={3} gap={4} display="flex" width="100%">
        <Box height="80px">
          <BoostMeter />
        </Box>
      </Box>
    </Stack>
  )
}
