import { Box, Button, CircularProgress, Link, Stack } from '@mui/material'

import NextLink from 'next/link'
import { AppRoutes } from '@/config/routes'
import { BigNumber } from 'ethers'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { createWithdrawTx } from '@/utils/lock'
import { useChainId } from '@/hooks/useChainId'
import { useSafeUserLockingInfos } from '@/hooks/useSafeTokenBalance'
import { timeRemaining } from '@/utils/date'
import PaperContainer from '../PaperContainer'
import { UnlockStats } from './UnlockStats'
import { WithdrawStats } from './WinthdrawStats'
import { UnlockTokenWidget } from './UnlockTokenWidget'
import { useLockHistory } from '@/hooks/useLockHistory'
import { useState } from 'react'

const TokenUnlocking = () => {
  const { isLoading: userLockingInfosLoading, data: userLockingInfos } = useSafeUserLockingInfos()
  const { sdk } = useSafeAppsSDK()
  const chainId = useChainId()
  const lockHistory = useLockHistory()

  const currentlyLocked = userLockingInfos?.lockedAmount ?? BigNumber.from(0)
  const unlockedTotal = userLockingInfos?.totalUnlockedAmount ?? BigNumber.from(0)
  const nextUnlock = userLockingInfos?.nextUnlock
  const unlockedReady = nextUnlock?.isUnlocked ? nextUnlock.unlockAmount : BigNumber.from(0)

  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const onWithdraw = async () => {
    setIsWithdrawing(true)
    const withdrawTx = createWithdrawTx(chainId)
    await sdk.txs.send({ txs: [withdrawTx] })

    setIsWithdrawing(false)
  }

  return (
    <Stack spacing={3}>
      <Link href={AppRoutes.activity} component={NextLink}>
        Back to locking
      </Link>
      <PaperContainer sx={{ width: '888px' }}>
        <UnlockStats
          currentlyLocked={currentlyLocked}
          unlockedTotal={unlockedTotal}
          loading={userLockingInfosLoading}
        />
      </PaperContainer>
      <PaperContainer sx={{ width: '888px' }}>
        <UnlockTokenWidget currentlyLocked={currentlyLocked} lockHistory={lockHistory} />
      </PaperContainer>
      <PaperContainer sx={{ width: '888px' }}>
        <WithdrawStats
          loading={userLockingInfosLoading}
          unlockedPending={unlockedTotal.sub(unlockedReady)}
          unlockedWithdrawable={unlockedReady}
          nextUnlock={nextUnlock}
        />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={onWithdraw}
            disabled={unlockedReady.eq(0) || isWithdrawing}
          >
            {isWithdrawing ? <CircularProgress size={20} /> : 'Withdraw'}
          </Button>
        </Box>
      </PaperContainer>
    </Stack>
  )
}

export default TokenUnlocking
