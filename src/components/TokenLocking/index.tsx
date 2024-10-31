import { Box, Grid, Stack, Typography } from '@mui/material'
import { useSafeTokenBalance } from '@/hooks/useSafeTokenBalance'
import { Leaderboard } from './Leaderboard'
import { CurrentStats } from './CurrentStats'
import { LockTokenWidget } from './LockTokenWidget'
import { ActivityRewardsInfo } from './ActivityRewardsInfo'
import { ActionNavigation } from './BoostGraph/ActionNavigation/ActionNavigation'
import PaperContainer from '../PaperContainer'
import { useSummarizedLockHistory } from '@/hooks/useSummarizedLockHistory'
import { useLockHistory } from '@/hooks/useLockHistory'

import css from './styles.module.css'
import { ExternalLink } from '../ExternalLink'
import SafePassDisclaimer from '../SafePassDisclaimer'

const TokenLocking = () => {
  const { isLoading: safeBalanceLoading, data: safeBalance } = useSafeTokenBalance()
  const { totalLocked, totalUnlocked, totalWithdrawable } = useSummarizedLockHistory(useLockHistory())

  const isUnlockAvailable = totalLocked.gt(0) || totalUnlocked.gt(0) || totalWithdrawable.gt(0)

  return (
    <Grid container spacing={3} direction="row-reverse">
      <Grid item xs={12} mt={4} mb={1} className={css.pageTitle} display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h2">{'Get your Safe{Pass} rewards'}</Typography>
        <Box ml="auto">
          <ExternalLink href="https://safe.global/pass">{'What is Safe{Pass}'}</ExternalLink>
        </Box>
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
          <SafePassDisclaimer />
        </Stack>
      </Grid>
    </Grid>
  )
}

export default TokenLocking
