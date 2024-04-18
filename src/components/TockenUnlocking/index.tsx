import { Box, Link, Stack, Typography } from '@mui/material'

import NextLink from 'next/link'
import { AppRoutes } from '@/config/routes'
import { toRelativeLockHistory } from '@/utils/lock'
import PaperContainer from '../PaperContainer'
import { UnlockStats } from './UnlockStats'
import { UnlockTokenWidget } from './UnlockTokenWidget'
import { useLockHistory } from '@/hooks/useLockHistory'
import { ChevronLeft } from '@mui/icons-material'

import { useMemo } from 'react'
import { useSummarizedLockHistory } from '@/hooks/useSummarizedLockHistory'
import { WithdrawWidget } from './WithdrawWidget'
import { useStartDate } from '@/hooks/useStartDates'
import { NAVIGATION_EVENTS } from '@/analytics/navigation'
import Track from '../Track'

const TokenUnlocking = () => {
  const { startTime } = useStartDate()
  const lockHistory = useLockHistory()

  const relativeLockHistory = useMemo(() => toRelativeLockHistory(lockHistory, startTime), [lockHistory, startTime])

  const { totalLocked, totalUnlocked, totalWithdrawable, pendingUnlocks } = useSummarizedLockHistory(lockHistory)

  return (
    <Box maxWidth="888px">
      <Stack spacing={3}>
        <Track {...NAVIGATION_EVENTS.OPEN_LOCKING} label="other page">
          <Link
            href={AppRoutes.activity}
            component={NextLink}
            sx={{ display: 'flex', alignItems: 'center', color: ({ palette }) => palette.primary.main }}
          >
            <ChevronLeft />
            Back to main
          </Link>
        </Track>

        <Typography variant="h1">Unlock / Withdraw</Typography>
        <PaperContainer>
          <UnlockStats currentlyLocked={totalLocked} unlockedTotal={totalUnlocked} />
        </PaperContainer>
        <PaperContainer>
          <UnlockTokenWidget currentlyLocked={totalLocked} lockHistory={relativeLockHistory} />
        </PaperContainer>
        <PaperContainer>
          <WithdrawWidget totalWithdrawable={totalWithdrawable} pendingUnlocks={pendingUnlocks} />
        </PaperContainer>
      </Stack>
    </Box>
  )
}

export default TokenUnlocking
