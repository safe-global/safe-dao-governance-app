import { Link, Stack, Typography } from '@mui/material'

import NextLink from 'next/link'
import { AppRoutes } from '@/config/routes'
import { toRelativeLockHistory } from '@/utils/lock'
import { useChainId } from '@/hooks/useChainId'
import PaperContainer from '../PaperContainer'
import { UnlockStats } from './UnlockStats'
import { UnlockTokenWidget } from './UnlockTokenWidget'
import { useLockHistory } from '@/hooks/useLockHistory'
import { ChevronLeft } from '@mui/icons-material'

import { useMemo } from 'react'
import { CHAIN_START_TIMESTAMPS } from '@/config/constants'
import { useSummarizedLockHistory } from '@/hooks/useSummarizedLockHistory'
import { WithdrawWidget } from './WithdrawWidget'

const TokenUnlocking = () => {
  const chainId = useChainId()
  const startTime = CHAIN_START_TIMESTAMPS[chainId]
  const lockHistory = useLockHistory()

  const relativeLockHistory = useMemo(() => toRelativeLockHistory(lockHistory, startTime), [lockHistory, startTime])

  const { totalLocked, totalUnlocked, totalWithdrawable, nextUnlock } = useSummarizedLockHistory(lockHistory)

  return (
    <Stack spacing={3}>
      <Link
        href={AppRoutes.activity}
        component={NextLink}
        sx={{ display: 'flex', alignItems: 'center', color: ({ palette }) => palette.primary.main }}
      >
        <ChevronLeft />
        Back to main
      </Link>

      <Typography variant="h1">Unlock / Withdraw</Typography>
      <PaperContainer sx={{ width: '888px' }}>
        <UnlockStats currentlyLocked={totalLocked} unlockedTotal={totalUnlocked} />
      </PaperContainer>
      <PaperContainer sx={{ width: '888px' }}>
        <UnlockTokenWidget currentlyLocked={totalLocked} lockHistory={relativeLockHistory} />
      </PaperContainer>
      <PaperContainer sx={{ width: '888px' }}>
        <WithdrawWidget totalWithdrawable={totalWithdrawable} nextUnlock={nextUnlock} />
      </PaperContainer>
    </Stack>
  )
}

export default TokenUnlocking
