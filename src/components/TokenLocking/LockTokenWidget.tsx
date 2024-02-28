import { formatAmount } from '@/utils/formatters'
import { Chip, Typography, Stack, Grid, TextField, InputAdornment, Skeleton, Button, Box, Divider } from '@mui/material'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import SafeToken from '@/public/images/token.svg'

import { BoostGraph } from './BoostGraph'
import { useTheme } from '@mui/material/styles'

import css from './styles.module.css'
import { createLockTx } from '@/utils/lock'
import { createApproveTx } from '@/utils/safe-token'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { useState, ChangeEvent, useMemo, useCallback, useEffect } from 'react'
import { BigNumberish } from 'ethers'
import { useChainId } from '@/hooks/useChainId'
import { getBoostFunction, getEarlyBirdBoost, getLockBoost } from '@/utils/boost'
import { FAKE_NOW, useLockHistory } from '@/hooks/useLockHistory'
import BoostCounter from '../BoostCounter'

const useDebouncedAmount = (amount: string, timeout: number) => {
  const [result, setResult] = useState<string>('0')

  useEffect(() => {
    const update = (value: string) => {
      setResult(value)
      console.log('Updating to ', value)
    }

    const updateTimeout = setTimeout(() => update(amount), timeout)
    return () => clearTimeout(updateTimeout)
  }, [amount, timeout])

  return result ?? '0'
}

export const LockTokenWidget = ({ safeBalance }: { safeBalance: BigNumberish | undefined }) => {
  const theme = useTheme()
  const { sdk, safe } = useSafeAppsSDK()
  const chainId = useChainId()
  const fakeNow = FAKE_NOW

  const lockHistory = useLockHistory()

  const prevEarlyBirdLock = lockHistory.find((lock) => lock.amount >= 1000)?.day
  const totalPrevLocked = lockHistory.reduce((prev, current) => current.amount + prev, 0)

  const [amount, setAmount] = useState('0')

  const [amountError, setAmountError] = useState<string | undefined>(undefined)

  const debouncedAmount = useDebouncedAmount(amount, 1000)
  const cleanedAmount = useMemo(() => (debouncedAmount.trim() === '' ? '0' : debouncedAmount.trim()), [debouncedAmount])

  const earlyBirdDays =
    prevEarlyBirdLock !== undefined ? prevEarlyBirdLock : Number(cleanedAmount) + totalPrevLocked >= 1000 ? fakeNow : 48
  const earlyBirdBoost = getEarlyBirdBoost(earlyBirdDays)

  const earlyBirdTimestamp = 1713823200000 + earlyBirdDays * 24 * 60 * 60 * 1000
  const earlyBirdDate = new Date(earlyBirdTimestamp)
  const newLockBoost = getLockBoost(Number(cleanedAmount) + totalPrevLocked)

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

  const onLockTokens = async () => {
    const approveTx = createApproveTx(chainId, parseUnits(amount, 18))
    const lockTx = createLockTx(chainId, parseUnits(amount, 18))
    await sdk.txs.send({ txs: [approveTx, lockTx] })
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
            <BoostGraph lockedAmount={Number(cleanedAmount)} pastLocks={lockHistory} />

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
                        <button className={css.maxButton}>Max</button>
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
                  disabled={Boolean(amountError)}
                >
                  Lock
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Box className={`${css.boostInfoBox} ${css.bordered}`} p={3}>
              <Typography variant="h4" textAlign="center" mb={3}>
                Boost breakdown
              </Typography>

              <Stack direction="row" width="100%" justifyContent="space-between">
                <Typography fontWeight={700}>Current Boost</Typography>
                <Typography fontWeight={700}>
                  {getBoostFunction(fakeNow, 0, lockHistory)({ x: fakeNow }).toFixed(2)}x
                </Typography>
              </Stack>

              <Stack direction="column" width="100%">
                <Divider />

                <Stack direction="column" width="100%" mt={2} mb={2}>
                  <Typography color={theme.palette.success.main}>Early Bird</Typography>
                  <Stack direction="row" width="100%" justifyContent="space-between">
                    <Typography fontWeight={700} color={theme.palette.success.main}>
                      {earlyBirdBoost.toFixed(2)}x
                    </Typography>
                    <Typography>({earlyBirdDays >= 48 ? 'None' : earlyBirdDate.toLocaleDateString()})</Typography>
                  </Stack>
                </Stack>
                <Stack direction="column" width="100%" mb={2}>
                  <Typography color={theme.palette.info.main}>Lock boost</Typography>
                  <Stack direction="row" width="100%" justifyContent="space-between">
                    <Typography fontWeight={700} color={theme.palette.info.main}>
                      {newLockBoost.toFixed(2)}x
                    </Typography>
                    <Typography>+{Number(cleanedAmount).toFixed(0)} SAFE</Typography>
                  </Stack>
                </Stack>

                <Divider />

                <Stack direction="column" width="100%" mt={2} alignItems="center">
                  <BoostCounter value={newLockBoost + earlyBirdBoost} variant="h3" fontWeight={700} />
                  <Typography variant="body2">Total boost</Typography>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </>
  )
}
