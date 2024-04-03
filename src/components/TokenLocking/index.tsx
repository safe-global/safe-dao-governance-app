import { Grid, Link, Stack, SvgIcon, Typography } from '@mui/material'
import { useSafeTokenBalance } from '@/hooks/useSafeTokenBalance'
import NextLink from 'next/link'
import { Leaderboard } from './Leaderboard'
import { CurrentStats } from './CurrentStats'
import { LockTokenWidget } from './LockTokenWidget'
import { ActivityRewardsInfo } from './ActivityRewardsInfo'
import { ActionNavigation } from './ActionNavigation'
import PaperContainer from '../PaperContainer'
import Asterix from '@/public/images/asterix.svg'
import { AppRoutes } from '@/config/routes'
import { useSummarizedLockHistory } from '@/hooks/useSummarizedLockHistory'
import { useLockHistory } from '@/hooks/useLockHistory'

const TokenLocking = () => {
  const { isLoading: safeBalanceLoading, data: safeBalance } = useSafeTokenBalance()
  const { totalLocked, totalUnlocked, totalWithdrawable } = useSummarizedLockHistory(useLockHistory())

  const isUnlockAvailable = totalLocked.gt(0) || totalUnlocked.gt(0) || totalWithdrawable.gt(0)

  return (
    <Grid container spacing={3} direction="row">
      <Grid item xs={12} mb={3}>
        <Typography variant="h2">SAFE Activity Rewards</Typography>
      </Grid>

      <Grid item xs={8}>
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
        </Stack>
      </Grid>

      <Grid item xs={4}>
        <Stack spacing={3} justifyContent="stretch" height="100%">
          <PaperContainer sx={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
            <SvgIcon
              component={Asterix}
              inheritViewBox
              sx={{ color: 'transparent', position: 'absolute', top: 0, right: 0, height: '208px', width: 'inherit' }}
            />
            <ActivityRewardsInfo />
          </PaperContainer>
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
