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
import { SAFE_TERMS_AND_CONDITIONS_URL } from '@/config/constants'

const TokenLocking = () => {
  const { isLoading: safeBalanceLoading, data: safeBalance } = useSafeTokenBalance()
  const { totalLocked, totalUnlocked, totalWithdrawable } = useSummarizedLockHistory(useLockHistory())

  const isUnlockAvailable = totalLocked.gt(0) || totalUnlocked.gt(0) || totalWithdrawable.gt(0)

  return (
    <Grid container spacing={3} direction="row-reverse">
      <Grid item xs={12} mt={4} mb={1} className={css.pageTitle}>
        <Typography variant="h2">{'Get rewards with Safe{Pass}'}</Typography>
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
              Please note that residents in{' '}
              <ExternalLink href={SAFE_TERMS_AND_CONDITIONS_URL}>certain jurisdictions</ExternalLink> (including the
              United States) may not be eligible for the boost and reward. This means that your boost might not be
              applied to certain reward types, e.g. token rewards such as Safe.
            </Typography>
          </Box>
          <ExternalLink href={SAFE_TERMS_AND_CONDITIONS_URL} m={2}>
            Terms and Conditions
          </ExternalLink>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default TokenLocking
