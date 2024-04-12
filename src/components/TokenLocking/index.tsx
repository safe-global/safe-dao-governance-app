import { Grid, Link, Stack, SvgIcon, Typography } from '@mui/material'
import { useSafeTokenBalance } from '@/hooks/useSafeTokenBalance'
import NextLink from 'next/link'
import { Leaderboard } from './Leaderboard'
import { CurrentStats } from './CurrentStats'
import { LockTokenWidget } from './LockTokenWidget'
import { ActivityRewardsInfo } from './ActivityRewardsInfo'
import { ActionNavigation } from './BoostGraph/ActionNavigation/ActionNavigation'
import PaperContainer from '../PaperContainer'
import { AppRoutes } from '@/config/routes'
import { useSummarizedLockHistory } from '@/hooks/useSummarizedLockHistory'
import { useLockHistory } from '@/hooks/useLockHistory'

import css from './styles.module.css'

const TokenLocking = () => {
  const { isLoading: safeBalanceLoading, data: safeBalance } = useSafeTokenBalance()
  const { totalLocked, totalUnlocked, totalWithdrawable } = useSummarizedLockHistory(useLockHistory())

  const isUnlockAvailable = totalLocked.gt(0) || totalUnlocked.gt(0) || totalWithdrawable.gt(0)

  return (
    <Grid container spacing={3} direction="row-reverse">
      <Grid item xs={12} mb={3} className={css.pageTitle}>
        <Typography variant="h2">SAFE Activity Rewards</Typography>
      </Grid>
      <Grid item xs={12} lg={4} className={css.activityRewards}>
        <Stack spacing={3} justifyContent="stretch" height="100%">
          <ActivityRewardsInfo />
        </Stack>
      </Grid>

      <Grid item xs={12} lg={8}>
        <Stack spacing={3}>
          <PaperContainer>
            <CurrentStats
              currentlyLocked={totalLocked ?? 0}
              loading={safeBalanceLoading}
              safeBalance={safeBalance ?? 0}
            />
          </PaperContainer>

          <PaperContainer>
            <LockTokenWidget safeBalance={safeBalance} />
            <ActionNavigation disabled={!isUnlockAvailable} />
          </PaperContainer>
          <PaperContainer>
            <Leaderboard />
          </PaperContainer>
          <Link href={AppRoutes.terms} component={NextLink} m={2} sx={{ textAlign: 'center' }}>
            Terms and Conditions
          </Link>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default TokenLocking
