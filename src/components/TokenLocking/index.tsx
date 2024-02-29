import { Grid, Paper, PaperProps, Stack, Typography } from '@mui/material'
import css from './styles.module.css'
import { useSafeTokenBalance, useSafeUserLockingInfos } from '@/hooks/useSafeTokenBalance'

import { Leaderboard } from './Leaderboard'
import { CurrentStats } from './CurrentStats'
import { LockTokenWidget } from './LockTokenWidget'
import { PlaceholderTopRight } from './PlaceholderTopRight'
import { ActionNavigation } from './ActionNavigation'
import PaperContainer from '../PaperContainer'

const TokenLocking = () => {
  const { isLoading: safeBalanceLoading, data: safeBalance } = useSafeTokenBalance()
  const { isLoading: userLockingInfosLoading, data: userLockingInfos } = useSafeUserLockingInfos()
  const currentlyLocked = userLockingInfos?.lockedAmount

  return (
    <Grid container spacing={3} direction="row">
      <Grid item xs={12} mb={3}>
        <Typography variant="h2">SAFE Activity Rewards</Typography>
      </Grid>

      <Grid item xs={8}>
        <Stack spacing={3}>
          <PaperContainer>
            <CurrentStats
              currentlyLocked={currentlyLocked ?? 0}
              loading={safeBalanceLoading}
              safeBalance={safeBalance ?? 0}
            />
          </PaperContainer>

          <PaperContainer>
            <LockTokenWidget safeBalance={safeBalance} />
            <ActionNavigation />
          </PaperContainer>
          <PaperContainer>
            <Leaderboard />
          </PaperContainer>
        </Stack>
      </Grid>

      <Grid item xs={4}>
        <Stack spacing={3}>
          <PaperContainer>
            <PlaceholderTopRight />
          </PaperContainer>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default TokenLocking
