import { Box, Button, CircularProgress, Grid, Link, Paper, Stack, Typography } from '@mui/material'

import NextLink from 'next/link'
import { AppRoutes } from '@/config/routes'
import { BigNumber } from 'ethers'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { createWithdrawTx, isUnlockEvent, isWithdrawEvent, toRelativeLockHistory } from '@/utils/lock'
import { useChainId } from '@/hooks/useChainId'
import { useSafeUserLockingInfos } from '@/hooks/useSafeTokenBalance'
import PaperContainer from '../PaperContainer'
import { UnlockStats } from './UnlockStats'
import { UnlockTokenWidget } from './UnlockTokenWidget'
import { UnlockEvent, useLockHistory, WithdrawEvent } from '@/hooks/useLockHistory'
import { ChevronLeft } from '@mui/icons-material'

import css from './styles.module.css'
import { formatUnits } from 'ethers/lib/utils'
import { Odometer } from '../Odometer'

import SafeToken from '@/public/images/token.svg'
import { useMemo, useState } from 'react'
import { CHAIN_START_TIMESTAMPS } from '@/config/constants'
import { isGreater24HoursDiff } from '@/utils/date'

const TokenUnlocking = () => {
  const { sdk } = useSafeAppsSDK()
  const chainId = useChainId()
  const startTime = CHAIN_START_TIMESTAMPS[chainId]
  const lockHistory = useLockHistory()

  const relativeLockHistory = useMemo(() => toRelativeLockHistory(lockHistory, startTime), [lockHistory, startTime])

  const currentlyLocked = useMemo(
    () =>
      lockHistory.reduce((prev, event) => {
        switch (event.eventType) {
          case 'LOCKED':
            return prev.add(event.amount)

          case 'UNLOCKED':
            return prev.sub(event.amount)

          case 'WITHDRAWN':
            return prev
        }
      }, BigNumber.from(0)),
    [lockHistory],
  )
  const unlockedTotal = useMemo(
    () =>
      lockHistory.reduce((prev, event) => {
        switch (event.eventType) {
          case 'LOCKED':
            return prev
          case 'UNLOCKED':
            return prev.add(event.amount)
          case 'WITHDRAWN':
            return prev.sub(event.amount)
        }
      }, BigNumber.from(0)),
    [lockHistory],
  )
  const withdrawable = useMemo(() => {
    const unlocks = lockHistory.filter((event) => isUnlockEvent(event)).map((event) => event as UnlockEvent)
    const withdrawnIds = lockHistory
      .filter((event) => isWithdrawEvent(event))
      .map((event) => event as WithdrawEvent)
      .map((withdraw) => withdraw.unlockIndex)

    // Unlocks that have not been withdrawn and are older than 24h
    return unlocks.filter(
      (unlock) =>
        !withdrawnIds.includes(unlock.unlockIndex) &&
        isGreater24HoursDiff(Date.parse(unlock.executionDate), Date.now()),
    )
  }, [lockHistory])

  const unlockedReady = useMemo(
    () => withdrawable.reduce((prev, event) => prev.add(event.amount), BigNumber.from(0)),
    [withdrawable],
  )

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
      <Link href={AppRoutes.activity} component={NextLink} sx={{ display: 'flex', alignItems: 'center' }}>
        <ChevronLeft />
        Back to main
      </Link>

      <Typography variant="h1">Unlock / Withdraw</Typography>
      <PaperContainer sx={{ width: '888px' }}>
        <UnlockStats currentlyLocked={currentlyLocked} unlockedTotal={unlockedTotal} />
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
