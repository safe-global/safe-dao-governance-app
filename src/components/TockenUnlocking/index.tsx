import { Box, Button, CircularProgress, Grid, Link, Paper, Stack, Typography } from '@mui/material'

import NextLink from 'next/link'
import { AppRoutes } from '@/config/routes'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { createWithdrawTx, toRelativeLockHistory } from '@/utils/lock'
import { useChainId } from '@/hooks/useChainId'
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
import { useSummarizedLockHistory } from '@/hooks/useSummarizedLockHistory'
import Track from '../Track'
import { LOCK_EVENTS } from '@/analytics/lockEvents'
import { trackSafeAppEvent } from '@/utils/analytics'
import { useTxSender } from '@/hooks/useTxSender'

const TokenUnlocking = () => {
  const { sdk } = useSafeAppsSDK()
  const chainId = useChainId()
  const startTime = CHAIN_START_TIMESTAMPS[chainId]
  const lockHistory = useLockHistory()
  const txSender = useTxSender()

  const isTransactionPossible = !!txSender

  const relativeLockHistory = useMemo(() => toRelativeLockHistory(lockHistory, startTime), [lockHistory, startTime])

  const { totalLocked, totalUnlocked, totalWithdrawable } = useSummarizedLockHistory(lockHistory)

  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const onWithdraw = async () => {
    setIsWithdrawing(true)
    const withdrawTx = createWithdrawTx(chainId)
    try {
      await txSender?.sendTxs([withdrawTx])
      trackSafeAppEvent(LOCK_EVENTS.WITHDRAW_SUCCESS.action)
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
        <UnlockStats currentlyLocked={totalLocked} unlockedTotal={totalUnlocked} />
      </PaperContainer>
      <PaperContainer sx={{ width: '888px' }}>
        <UnlockTokenWidget currentlyLocked={totalLocked} lockHistory={relativeLockHistory} />
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
                    <Odometer value={Number(formatUnits(totalWithdrawable ?? '0', 18))} decimals={2} /> SAFE
                  </Typography>
                </Grid>
              </Box>
              <Track {...LOCK_EVENTS.WITHDRAW_BUTTON}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onWithdraw}
                  disabled={totalWithdrawable.eq(0) || isWithdrawing || !isTransactionPossible}
                  sx={{ ml: 'auto !important' }}
                >
                  {isWithdrawing ? <CircularProgress size={20} /> : 'Withdraw'}
                </Button>
              </Track>
            </Stack>
          </Paper>
        </Grid>
      </PaperContainer>
    </Stack>
  )
}

export default TokenUnlocking
