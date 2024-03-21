import { formatAmount } from '@/utils/formatters'
import { Chip, Typography, Stack, Grid, TextField, InputAdornment, Button, Box, CircularProgress } from '@mui/material'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import SafeToken from '@/public/images/token.svg'

import { BoostGraph } from './BoostGraph/BoostGraph'

import css from './styles.module.css'
import { createLockTx, toRelativeLockHistory } from '@/utils/lock'
import { createApproveTx } from '@/utils/safe-token'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { useState, ChangeEvent, useMemo, useCallback } from 'react'
import { BigNumberish } from 'ethers'
import { useChainId } from '@/hooks/useChainId'
import { getBoostFunction } from '@/utils/boost'
import { useLockHistory } from '@/hooks/useLockHistory'
import { useDebounce } from '@/hooks/useDebounce'
import { SEASON2_START } from './BoostGraph/graphConstants'
import { CHAIN_START_TIMESTAMPS } from '@/config/constants'
import { getCurrentDays } from '@/utils/date'
import { BoostBreakdown } from './BoostBreakdown'

export const LockTokenWidget = ({ safeBalance }: { safeBalance: BigNumberish | undefined }) => {
  const { sdk } = useSafeAppsSDK()
  const chainId = useChainId()
  const startTime = CHAIN_START_TIMESTAMPS[chainId]
  const todayInDays = getCurrentDays(startTime)

  const pastLocks = useLockHistory()

  const relativeLockHistory = useMemo(() => toRelativeLockHistory(pastLocks, startTime), [pastLocks, startTime])

  const [amount, setAmount] = useState('0')

  const [amountError, setAmountError] = useState<string | undefined>(undefined)

  const [isLocking, setIsLocking] = useState(false)

  const debouncedAmount = useDebounce(amount, 1000, '0')
  const cleanedAmount = useMemo(() => (debouncedAmount.trim() === '' ? '0' : debouncedAmount.trim()), [debouncedAmount])

  const currentBoostFunction = useMemo(
    () => getBoostFunction(todayInDays, 0, relativeLockHistory),
    [relativeLockHistory, todayInDays],
  )
  const newBoostFunction = useMemo(
    () => getBoostFunction(todayInDays, Number(cleanedAmount), relativeLockHistory),
    [cleanedAmount, relativeLockHistory, todayInDays],
  )

  const validateAmount = useCallback(
    (newAmount: string) => {
      const parsed = parseUnits(newAmount, 18)
      if (parsed.gt(safeBalance ?? '0')) {
        return 'Amount exceeds balance'
      }
    },
    [safeBalance],
  )

  const onChangeAmount = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const error = validateAmount(event.target.value || '0')

      setAmount(event.target.value)
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

  const onLockTokens = async () => {
    setIsLocking(true)
    const approveTx = createApproveTx(chainId, parseUnits(amount, 18))
    const lockTx = createLockTx(chainId, parseUnits(amount, 18))
    try {
      await sdk.txs.send({ txs: [approveTx, lockTx] })
    } catch (error) {
      console.error(error)
    }
    setIsLocking(false)
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        <Chip label="1" size="medium" sx={{ width: '32px' }} />
        <Typography variant="h4" fontWeight={700}>
          Increase your boost for future points
        </Typography>
      </Box>
      <Stack
        spacing={3}
        className={css.bordered}
        sx={{
          padding: 3,
        }}
      >
        <Grid container direction="row" spacing={2}>
          <Grid item xs={8}>
            <BoostGraph lockedAmount={Number(cleanedAmount)} pastLocks={relativeLockHistory} isLock />

            <Grid container gap={2} flexWrap="nowrap" mb={1} alignItems="center">
              <Grid item xs={8}>
                <Typography mb={1}>Select amount to lock</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
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
                        <button onClick={onSetToMax} className={css.maxButton}>
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

              <Grid item xs={4}>
                <Button
                  onClick={onLockTokens}
                  variant="contained"
                  fullWidth
                  disableElevation
                  disabled={Boolean(amountError) || isLocking || cleanedAmount === '0'}
                >
                  {isLocking ? <CircularProgress size={20} /> : 'Lock'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <BoostBreakdown
              realizedBoost={currentBoostFunction({ x: todayInDays })}
              currentFinalBoost={currentBoostFunction({ x: SEASON2_START })}
              newFinalBoost={newBoostFunction({ x: SEASON2_START })}
              isLock
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  )
}
