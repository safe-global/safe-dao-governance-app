import { formatAmount } from '@/utils/formatters'
import { Box, Typography, LinearProgress } from '@mui/material'

import css from './styles.module.css'

const boostFunction = (x: number) => 0.001 * x + 1
const targetFunction = (boost: number) => boost * 1000

export const BoostGauge = ({ lockedTokens, amount }: { lockedTokens: number; amount: number }) => {
  const currentBoost = boostFunction(lockedTokens)
  const futureBoost = boostFunction(lockedTokens + amount)

  const lowerBound = Math.floor(currentBoost)
  const upperBound = Math.ceil(futureBoost)
  const currentProgress = ((currentBoost - lowerBound) / (upperBound - lowerBound)) * 100
  const increasedProgress = ((futureBoost - currentBoost) / (upperBound - currentBoost)) * 100
  const tokensForNextTier = targetFunction(upperBound - 1) - (lockedTokens + amount)

  return (
    <Box>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Current Boost: {formatAmount(currentBoost, 2)}x</Typography>
        <Typography variant="h5">Boost after locking: {formatAmount(futureBoost, 2)}x</Typography>
      </Box>
      <Typography variant="body2">
        Unlock {upperBound}x by locking <b>{Math.ceil(tokensForNextTier)}</b> more SAFE.
      </Typography>
      <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
        <Typography>{lowerBound}x</Typography>
        <Box display="flex" flexDirection="row" alignItems="center" width="100%">
          <LinearProgress
            className={css.gauge}
            variant="determinate"
            value={100}
            sx={{ width: `${Math.floor(currentProgress)}%` }}
          />
          <LinearProgress
            variant="determinate"
            className={css.gauge}
            value={increasedProgress}
            color="secondary"
            sx={{
              width: `${Math.floor(100 - currentProgress)}%`,
              backgroundColor: '#A5A4A4',
            }}
          />
        </Box>
        <Typography>{upperBound}x</Typography>
      </Box>
    </Box>
  )
}
