import { Box, Grid, Link, Stack, SvgIcon, Typography } from '@mui/material'
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
      <Grid item xs={12}>
        <Typography variant="h2" mt={4} mb={1} fontSize="44px">
          SAFE Activity Rewards
        </Typography>
      </Grid>
      <Grid item xs={12} lg={4}>
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
          <Box>
            <Typography variant="overline" fontWeight="bold" color="text.secondary">
              LEGAL DISCLAIMER
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please note that country restrictions may apply regarding the eligibility and application for the boost
              and reward. This might mean that your boost might not be applied to certain reward types, e.g. token
              rewards such as Safe.
            </Typography>
          </Box>
          <Link href={AppRoutes.terms} component={NextLink} m={2}>
            Terms and Conditions
          </Link>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default TokenLocking
