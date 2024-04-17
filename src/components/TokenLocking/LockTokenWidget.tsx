import { formatAmount } from '@/utils/formatters'
import { Typography, Stack, Grid, TextField, InputAdornment, Button, Box, CircularProgress, Link } from '@mui/material'
import NorthEastIcon from '@mui/icons-material/NorthEast'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import SafeToken from '@/public/images/token.svg'

import { BoostGraph } from './BoostGraph/BoostGraph'

import css from './styles.module.css'
import { createLockTx, toRelativeLockHistory } from '@/utils/lock'
import { createApproveTx } from '@/utils/safe-token'
import { useState, ChangeEvent, useMemo, useCallback, useEffect } from 'react'
import { BigNumber, BigNumberish } from 'ethers'
import { useChainId } from '@/hooks/useChainId'
import { getBoostFunction } from '@/utils/boost'
import { useLockHistory } from '@/hooks/useLockHistory'
import { useDebounce } from '@/hooks/useDebounce'
import { SEASON2_START, UNLIMITED_APPROVAL_AMOUNT } from '@/config/constants'
import { getCurrentDays } from '@/utils/date'
import { BoostBreakdown } from './BoostBreakdown'
import Track from '../Track'
import { LOCK_EVENTS } from '@/analytics/lockEvents'
import { trackSafeAppEvent } from '@/utils/analytics'
import MilesReceipt from '@/components/TokenLocking/MilesReceipt'
import { BaseTransaction, useTxSender } from '@/hooks/useTxSender'
import { useSafeTokenLockingAllowance } from '@/hooks/useSafeTokenBalance'
import { AppRoutes } from '@/config/routes'
import NextLink from 'next/link'
import { useStartDate } from '@/hooks/useStartDates'
import { NAVIGATION_EVENTS } from '@/analytics/navigation'

export const LockTokenWidget = ({ safeBalance }: { safeBalance: BigNumberish | undefined }) => {
  const [receiptOpen, setReceiptOpen] = useState<boolean>(false)
  const chainId = useChainId()
  const txSender = useTxSender()
  const { startTime } = useStartDate()
  const todayInDays = getCurrentDays(startTime)
  const { data: safeTokenAllowance, isLoading: isAllowanceLoading } = useSafeTokenLockingAllowance()

  const pastLocks = useLockHistory()

  const relativeLockHistory = useMemo(() => toRelativeLockHistory(pastLocks, startTime), [pastLocks, startTime])

  const [amount, setAmount] = useState('0')

  const [amountError, setAmountError] = useState<string | undefined>(undefined)

  const [isLocking, setIsLocking] = useState(false)

  const [receiptInformation, setReceiptInformation] = useState<{ newFinalBoost: number; amount: string }>({
    amount: '0',
    newFinalBoost: 1,
  })

  const onCloseReceipt = () => {
    setReceiptOpen(false)
  }

  const debouncedAmount = useDebounce(amount, 1000, '0')
  const cleanedAmount = useMemo(() => (debouncedAmount.trim() === '' ? '0' : debouncedAmount.trim()), [debouncedAmount])

  useEffect(() => {
    if (debouncedAmount !== '0') {
      trackSafeAppEvent(LOCK_EVENTS.CHANGE_LOCK_AMOUNT.action, LOCK_EVENTS.CHANGE_LOCK_AMOUNT.label)
    }
  }, [debouncedAmount])

  const currentBoostFunction = useMemo(
    () => getBoostFunction(todayInDays, 0, relativeLockHistory),
    [relativeLockHistory, todayInDays],
  )
  const newBoostFunction = useMemo(
    () => getBoostFunction(todayInDays, Number(cleanedAmount), relativeLockHistory),
    [cleanedAmount, relativeLockHistory, todayInDays],
  )

  const boostIn10DaysFunction = useMemo(
    () => getBoostFunction(todayInDays + 10, Number(cleanedAmount), relativeLockHistory),
    [cleanedAmount, relativeLockHistory, todayInDays],
  )

  const validateAmount = useCallback(
    (newAmount: string) => {
      const numberAmount = Number(newAmount)
      if (isNaN(numberAmount)) {
        return 'The value must be a number'
      }
      const parsed = parseUnits(numberAmount.toString(), 18)
      if (parsed.gt(safeBalance ?? '0')) {
        return 'Amount exceeds balance'
      }
      if (parsed.lte(0)) {
        return 'Amount must be greater than zero'
      }
    },
    [safeBalance],
  )

  const onChangeAmount = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value.replaceAll(',', '.')
      const error = validateAmount(newValue || '0')

      setAmount(newValue)
      setAmountError(error)
    },
    [validateAmount],
  )

  const onSetToMax = useCallback(() => {
    if (!safeBalance) {
      return
    }
    setAmount(formatUnits(safeBalance, 18))
  }, [safeBalance])

  const isMaxDisabled = BigNumber.from(0).gte(safeBalance ?? 0)

  const onLockTokens = async () => {
    if (!txSender) {
      throw new Error('Cannot lock tokens without connected wallet')
    }
    try {
      const amountToLockWei = parseUnits(amount, 18)
      setIsLocking(true)
      let txs: BaseTransaction[] = []
      if (BigNumber.from(safeTokenAllowance).lt(amountToLockWei)) {
        // Approval is too low for the locking operation
        const approvalAmount = txSender?.isBatchingSupported ? amountToLockWei : UNLIMITED_APPROVAL_AMOUNT
        txs.push(createApproveTx(chainId, approvalAmount))
      }
      txs.push(createLockTx(chainId, amountToLockWei))

      if (txSender?.isBatchingSupported) {
        await txSender.sendTxs(txs)
      } else {
        for (let i = 0; i < txs.length; i++) {
          await txSender?.sendTxs([txs[i]])
        }
      }
      const finalBoostAfterLocking = newBoostFunction({ x: SEASON2_START })
      trackSafeAppEvent(LOCK_EVENTS.LOCK_SUCCESS.action)
      setReceiptInformation({ newFinalBoost: finalBoostAfterLocking, amount })
      setAmount('0')
      setReceiptOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLocking(false)
    }
  }

  const isDisabled = isAllowanceLoading || Boolean(amountError) || isLocking || cleanedAmount === '0'

  return (
    <>
      <Box className={css.lockingHeader} gap={2}>
        <Box display="flex" flex="1" alignItems="center" flexDirection="row" gap={2}>
          <NorthEastIcon color="primary" />
          <Typography variant="h4" fontWeight={700}>
            Lock tokens to boost your miles
          </Typography>
        </Box>
        <Track {...NAVIGATION_EVENTS.OPEN_BOOST_INFO}>
          <Link href={AppRoutes.boost} component={NextLink}>
            How does boost work?
          </Link>
        </Track>
      </Box>
      <Stack
        spacing={3}
        className={css.bordered}
        sx={{
          padding: 3,
        }}
      >
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} md={8}>
            <BoostGraph lockedAmount={Number(cleanedAmount)} pastLocks={relativeLockHistory} isLock />

            <Grid container spacing={2} mb={1} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography mb={1}>Select amount to lock</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  onFocus={(event) => {
                    event.target.select()
                  }}
                  value={amount}
                  onChange={onChangeAmount}
                  helperText={amountError}
                  error={!!amountError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ width: '24px', height: '24px' }}>
                        <SafeToken />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <button disabled={isMaxDisabled} onClick={onSetToMax} className={css.maxButton}>
                          Max
                        </button>
                      </InputAdornment>
                    ),
                  }}
                  className={css.input}
                />
                <Typography variant="caption">
                  Balance: {formatAmount(formatUnits(safeBalance ?? '0', 18), 2)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Track {...LOCK_EVENTS.LOCK_BUTTON}>
                  <Button onClick={onLockTokens} variant="contained" fullWidth disableElevation disabled={isDisabled}>
                    {isLocking ? <CircularProgress size={20} /> : 'Lock'}
                  </Button>
                </Track>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <BoostBreakdown
              realizedBoost={currentBoostFunction({ x: todayInDays })}
              currentFinalBoost={currentBoostFunction({ x: SEASON2_START })}
              newFinalBoost={newBoostFunction({ x: SEASON2_START })}
              isLock
              boostPrediction={boostIn10DaysFunction({ x: SEASON2_START })}
            />
          </Grid>
        </Grid>
      </Stack>
      <MilesReceipt
        open={receiptOpen}
        onClose={onCloseReceipt}
        amount={receiptInformation.amount}
        newFinalBoost={receiptInformation.newFinalBoost}
      />
    </>
  )
}
