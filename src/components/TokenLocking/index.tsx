import { Box, Grid, Stack, Typography } from '@mui/material'
import { useSafeTokenBalance } from '@/hooks/useSafeTokenBalance'
import { ActionNavigation } from './BoostGraph/ActionNavigation/ActionNavigation'
import PaperContainer from '../PaperContainer'
import { useSummarizedLockHistory } from '@/hooks/useSummarizedLockHistory'
import { useLockHistory } from '@/hooks/useLockHistory'

import css from './styles.module.css'
import { ExternalLink } from '../ExternalLink'
import SafePassDisclaimer from '../SafePassDisclaimer'
import { useOwnLockingRank } from '@/hooks/useLeaderboard'
import { TokenAmount } from '@/components/TokenAmount'

const TokenLocking = () => {
  const { isLoading: safeBalanceLoading } = useSafeTokenBalance()
  const { totalLocked, totalUnlocked, totalWithdrawable } = useSummarizedLockHistory(useLockHistory())

  const ownRankResult = useOwnLockingRank()
  const { data: ownRank } = ownRankResult

  const isUnlockAvailable = totalLocked.gt(0) || totalUnlocked.gt(0) || totalWithdrawable.gt(0)

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
        lg={8}
        mt={4}
        mb={1}
        className={css.pageTitle}
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <Typography variant="h2">{'Safe{Pass} has concluded'}</Typography>
        <Box ml="auto">
          <ExternalLink href="https://safe.global/pass">{'What is Safe{Pass}'}</ExternalLink>
        </Box>
      </Grid>

      <Grid item xs={12} lg={8}>
        <Stack spacing={3}>
          <PaperContainer>
            {ownRank && (
              <Typography fontWeight="bold">Congratulations, you reached rank {ownRank.position}.</Typography>
            )}

            {isUnlockAvailable && <Typography>Make sure to unlock any remaining tokens.</Typography>}

            <TokenAmount amount={totalLocked ?? 0} label="Locked" loading={safeBalanceLoading} />

            <ActionNavigation disabled={!isUnlockAvailable} />
          </PaperContainer>
          <SafePassDisclaimer />
        </Stack>
      </Grid>
    </Grid>
  )
}

export default TokenLocking
