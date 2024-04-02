import { Grid, Link, Stack, SvgIcon, Typography } from '@mui/material'
import { useSafeTokenBalance, useSafeUserLockingInfos } from '@/hooks/useSafeTokenBalance'
import NextLink from 'next/link'
import { Leaderboard } from './Leaderboard'
import { CurrentStats } from './CurrentStats'
import { LockTokenWidget } from './LockTokenWidget'
import { ActivityRewardsInfo } from './ActivityRewardsInfo'
import { ActionNavigation } from './ActionNavigation'
import PaperContainer from '../PaperContainer'
import { AppRoutes } from '@/config/routes'

import css from './styles.module.css'

const TokenLocking = () => {
  const { isLoading: safeBalanceLoading, data: safeBalance } = useSafeTokenBalance()
  const { isLoading: userLockingInfosLoading, data: userLockingInfos } = useSafeUserLockingInfos()
  const currentlyLocked = userLockingInfos?.lockedAmount

  return (
    <Grid container spacing={3} direction="row">
      <Grid item xs={12} mb={3}>
        <Typography variant="h2">SAFE Activity Rewards</Typography>
      </Grid>

      <Grid item xs={12} lg={8}>
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

      <Grid item xs={12} lg={4} className={css.activityRewards}>
        <Stack spacing={3} justifyContent="stretch" height="100%">
          <ActivityRewardsInfo />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Link href={AppRoutes.terms} component={NextLink} sx={{ float: 'right' }}>
          Terms and Conditions
        </Link>
      </Grid>
    </Grid>
  )
}

export default TokenLocking
