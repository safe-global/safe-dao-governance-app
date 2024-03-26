import { Box, Button, CircularProgress, Grid, Link, Paper, Stack, Typography } from '@mui/material'

import NextLink from 'next/link'
import { AppRoutes } from '@/config/routes'
import { BigNumber } from 'ethers'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { createWithdrawTx, toRelativeLockHistory } from '@/utils/lock'
import { useChainId } from '@/hooks/useChainId'
import { useSafeUserLockingInfos } from '@/hooks/useSafeTokenBalance'
import PaperContainer from '../PaperContainer'
import { UnlockStats } from './UnlockStats'
import { UnlockTokenWidget } from './UnlockTokenWidget'
import { useLockHistory } from '@/hooks/useLockHistory'
import { ChevronLeft } from '@mui/icons-material'

import css from './styles.module.css'
import { formatUnits } from 'ethers/lib/utils'
import { Odometer } from '../Odometer'

import SafeToken from '@/public/images/token.svg'
import { useMemo, useState } from 'react'
import { CHAIN_START_TIMESTAMPS } from '@/config/constants'

const TokenUnlocking = () => {
  const { isLoading: userLockingInfosLoading, data: userLockingInfos } = useSafeUserLockingInfos()
  const { sdk } = useSafeAppsSDK()
  const chainId = useChainId()
  const startTime = CHAIN_START_TIMESTAMPS[chainId]
  const lockHistory = useLockHistory()

  const relativeLockHistory = useMemo(() => toRelativeLockHistory(lockHistory, startTime), [lockHistory, startTime])

  const currentlyLocked = userLockingInfos?.lockedAmount ?? BigNumber.from(0)
  const unlockedTotal = userLockingInfos?.totalUnlockedAmount ?? BigNumber.from(0)
  const nextUnlock = userLockingInfos?.nextUnlock
  const unlockedReady = nextUnlock?.isUnlocked ? nextUnlock.unlockAmount : BigNumber.from(0)

  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const onWithdraw = async () => {
    setIsWithdrawing(true)
    const withdrawTx = createWithdrawTx(chainId)
    try {
      await sdk.txs.send({ txs: [withdrawTx] })
    } catch (error) {
      console.error(error)
    }

    setIsWithdrawing(false)
  }

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
        <UnlockStats
          currentlyLocked={currentlyLocked}
          unlockedTotal={unlockedTotal}
          loading={userLockingInfosLoading}
        />
      </PaperContainer>
      <PaperContainer sx={{ width: '888px' }}>
        <UnlockTokenWidget currentlyLocked={currentlyLocked} lockHistory={relativeLockHistory} />
      </PaperContainer>
      <PaperContainer sx={{ width: '888px' }}>
        <Typography variant="h4" fontWeight={700}>
          Withdraw your tokens
        </Typography>
        <Typography>After unlocking tokens you need to wait 24h to be able to withdraw your tokens.</Typography>

        <Grid item xs={6}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: ({ palette }) => palette.background.default,
              color: ({ palette }) => palette.text.primary,
              position: 'relative',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <SafeToken width={48} height={48} />
              <Box>
                <Typography color="text.secondary">Withdrawable</Typography>

                <Grid item display="flex" alignItems="center">
                  <Typography
                    variant="h3"
                    variantMapping={{
                      h3: 'span',
                    }}
                    className={css.amountDisplay}
                  >
                    <Odometer value={Number(formatUnits(unlockedReady ?? '0', 18))} decimals={2} /> SAFE
                  </Typography>
                </Grid>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={onWithdraw}
                disabled={unlockedReady.eq(0) || isWithdrawing}
                sx={{ ml: 'auto !important' }}
              >
                {isWithdrawing ? <CircularProgress size={20} /> : 'Withdraw'}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </PaperContainer>
    </Stack>
  )
}

export default TokenUnlocking
