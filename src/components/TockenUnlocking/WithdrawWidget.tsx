import { LOCK_EVENTS } from '@/analytics/lockEvents'
import { Box, Typography, Grid, Paper, Stack, Button, CircularProgress, SvgIcon } from '@mui/material'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { Odometer } from '../Odometer'
import Track from '../Track'
import SafeToken from '@/public/images/token.svg'
import ClockIcon from '@/public/images/clock.svg'

import css from './styles.module.css'
import { BigNumber } from 'ethers'
import { useState } from 'react'
import { trackSafeAppEvent } from '@/utils/analytics'
import { createWithdrawTx } from '@/utils/lock'
import { useTxSender } from '@/hooks/useTxSender'
import { useChainId } from '@/hooks/useChainId'
import { UnlockEvent } from '@/hooks/useLockHistory'
import { formatAmount } from '@/utils/formatters'
import { DAY_IN_MS, formatDate } from '@/utils/date'

export const WithdrawWidget = ({
  totalWithdrawable,
  nextUnlock,
}: {
  totalWithdrawable: BigNumber
  nextUnlock: UnlockEvent | undefined
}) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const txSender = useTxSender()
  const chainId = useChainId()
  const isTransactionPossible = !!txSender

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
    <>
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
          <Grid container direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} sm={8} display="inline-flex" gap={1} alignItems="center">
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
            </Grid>
            <Grid item xs={12} md={4}>
              <Track {...LOCK_EVENTS.WITHDRAW_BUTTON}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onWithdraw}
                  fullWidth
                  disabled={totalWithdrawable.eq(0) || isWithdrawing || !isTransactionPossible}
                >
                  {isWithdrawing ? <CircularProgress size={20} /> : 'Withdraw'}
                </Button>
              </Track>
            </Grid>
          </Grid>
          {nextUnlock && (
            <Box className={css.nextWithdrawal}>
              <SvgIcon color="primary" component={ClockIcon} inheritViewBox fontSize="small" />
              <Typography>
                {formatAmount(formatUnits(nextUnlock.amount, 18), 0)} SAFE will be withdrawable starting{' '}
                {formatDate(new Date(Date.parse(nextUnlock.executionDate) + DAY_IN_MS))}.
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </>
  )
}
