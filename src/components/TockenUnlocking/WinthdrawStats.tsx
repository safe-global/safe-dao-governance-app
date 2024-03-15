import { SingleUnlock } from '@/hooks/useSafeTokenBalance'
import { timeRemaining } from '@/utils/date'
import { InfoOutlined } from '@mui/icons-material'
import { Grid, Paper, Typography, Tooltip, Skeleton } from '@mui/material'
import { BigNumber, BigNumberish } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { Odometer } from '../Odometer'

import css from './styles.module.css'

export const WithdrawStats = ({
  loading,
  unlockedPending,
  unlockedWithdrawable,
  nextUnlock,
}: {
  unlockedPending: BigNumberish
  unlockedWithdrawable: BigNumberish
  nextUnlock: SingleUnlock | undefined
  loading: boolean
}) => {
  const nextUnlockAmount = nextUnlock ? Number(formatUnits(nextUnlock?.unlockAmount, 18)) : 0

  const timeToUnlock =
    nextUnlock?.isUnlocked || !nextUnlock ? undefined : timeRemaining(nextUnlock.unlockedAt.toNumber())

  return (
    <Grid container direction="row" spacing={3}>
      <Grid item xs={5}>
        <Paper
          sx={{
            p: 3,
            backgroundColor: ({ palette }) => palette.background.default,
            color: ({ palette }) => palette.text.primary,
            position: 'relative',
          }}
        >
          <Typography fontWeight={700}>Unlocked (Pending)</Typography>

          <Grid item display="flex" alignItems="center">
            <Typography
              variant="h3"
              variantMapping={{
                h3: 'span',
              }}
              className={css.amountDisplay}
            >
              {loading ? (
                <Skeleton />
              ) : (
                <>
                  <Odometer value={Number(formatUnits(unlockedPending ?? '0', 18))} decimals={2} /> SAFE
                </>
              )}
            </Typography>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={2}>
        {!nextUnlock?.isUnlocked && (
          <>
            <Typography variant="h4">Next unlock</Typography>
            <Typography>
              {nextUnlockAmount.toFixed(2)} SAFE in
              {timeToUnlock?.days && (
                <>
                  {timeToUnlock.days} day{timeToUnlock.days > 1 && 's'}
                </>
              )}
              {timeToUnlock?.hours && (
                <>
                  {timeToUnlock.hours} hour{timeToUnlock.hours > 1 && 's'}
                </>
              )}
              {timeToUnlock?.minutes && (
                <>
                  {timeToUnlock.minutes} minute{timeToUnlock.minutes > 1 && 's'}
                </>
              )}
            </Typography>
          </>
        )}
      </Grid>

      <Grid item xs={5}>
        <Paper
          sx={{
            p: 3,
            backgroundColor: ({ palette }) => palette.background.default,
            color: ({ palette }) => palette.text.primary,
            position: 'relative',
          }}
        >
          <Typography fontWeight={700}>Withdrawable</Typography>

          <Grid item display="flex" alignItems="center">
            <Typography
              variant="h3"
              variantMapping={{
                h3: 'span',
              }}
              className={css.amountDisplay}
            >
              <Odometer value={Number(formatUnits(unlockedWithdrawable ?? 0, 18))} decimals={2} /> SAFE
            </Typography>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}
