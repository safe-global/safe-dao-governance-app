import { FAKE_NOW } from '@/hooks/useLockHistory'
import { useTheme } from '@mui/material/styles'
import SafeToken from '@/public/images/token.svg'
import { getBoostFunction, getTimeFactor, getTokenBoost, LockHistory } from '@/utils/boost'
import { formatAmount } from '@/utils/formatters'
import css from './styles.module.css'
import { Box, Stack, Grid, Typography, TextField, InputAdornment, Button, Divider } from '@mui/material'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import BoostCounter from '../BoostCounter'
import { BoostGraph } from '../TokenLocking/BoostGraph/BoostGraph'
import { useDebounce } from '@/hooks/useDebounce'
import { createUnlockTx } from '@/utils/lock'
import { useState, useMemo, ChangeEvent, useCallback } from 'react'
import { BigNumberish } from 'ethers'
import { useChainId } from '@/hooks/useChainId'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

export const UnlockTokenWidget = ({
  lockHistory,
  currentlyLocked,
}: {
  lockHistory: LockHistory[]
  currentlyLocked: BigNumberish
}) => {
  const [unlockAmount, setUnlockAmount] = useState('0')
  const [unlockAmountError, setUnlockAmountError] = useState<string>()
  const chainId = useChainId()
  const { sdk } = useSafeAppsSDK()
  const theme = useTheme()

  const debouncedAmount = useDebounce(unlockAmount, 1000, '0')
  const cleanedAmount = useMemo(() => (debouncedAmount.trim() === '' ? '0' : debouncedAmount.trim()), [debouncedAmount])

  const boostFunction = useMemo(() => {
    return getBoostFunction(FAKE_NOW, -Number(cleanedAmount), lockHistory)
  }, [cleanedAmount, lockHistory])
  const earlyBirdBoostFunction = useMemo(() => {
    return getBoostFunction(FAKE_NOW, -Number(cleanedAmount), lockHistory)
  }, [cleanedAmount, lockHistory])
  const endOfSeasonBoost = boostFunction({ x: 158 })
  const earlyBirdBoost = earlyBirdBoostFunction({ x: 48 }) - 1
  const newLockBoost = endOfSeasonBoost - earlyBirdBoost

  const onChangeUnlockAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const error = validateAmount(event.target.value || '0')
    setUnlockAmount(event.target.value)
    setUnlockAmountError(error)
  }

  const validateAmount = (newAmount: string) => {
    const parsed = parseUnits(newAmount, 18)
    if (parsed.gt(currentlyLocked ?? '0')) {
      return 'Amount exceeds locked tokens'
    }
  }

  const onSetToMax = useCallback(() => {
    if (!currentlyLocked) {
      return
    }
    setUnlockAmount(formatUnits(currentlyLocked, 18))
  }, [currentlyLocked])

  const onUnlock = async () => {
    const unlockTx = createUnlockTx(chainId, parseUnits(unlockAmount, 18))
    await sdk.txs.send({ txs: [unlockTx] })
  }

  return (
    <Stack
      spacing={3}
      className={css.bordered}
      sx={{
        padding: 3,
      }}
    >
      <Grid container direction="row" spacing={2}>
        <Grid item xs={8}>
          <BoostGraph lockedAmount={-Number(cleanedAmount)} pastLocks={lockHistory} isLock={false} />

          <Grid item container gap={2} flexWrap="nowrap" xs={12} mb={1} alignItems="center">
            <Grid item xs={9}>
              <Typography mb={1}>Select amount to unlock</Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={unlockAmount}
                helperText={unlockAmountError}
                error={Boolean(unlockAmountError)}
                onChange={onChangeUnlockAmount}
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
                Available: {formatAmount(formatUnits(currentlyLocked ?? '0', 18), 2)}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Button
                onClick={onUnlock}
                variant="contained"
                fullWidth
                disableElevation
                disabled={Boolean(unlockAmountError)}
              >
                Unlock
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
                {getBoostFunction(FAKE_NOW, 0, lockHistory)({ x: FAKE_NOW }).toFixed(2)}x
              </Typography>
            </Stack>

            <Stack direction="column" width="100%">
              <Divider />

              <Stack direction="column" width="100%" mt={2} mb={2}>
                <Typography color={theme.palette.success.light}>Early Bird</Typography>
                <Stack direction="row" width="100%" justifyContent="space-between">
                  <Typography fontWeight={700} color={theme.palette.success.light}>
                    {earlyBirdBoost.toFixed(2)}x
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="column" width="100%" mb={2}>
                <Typography color={theme.palette.info.light}>Lock boost</Typography>
                <Stack direction="row" width="100%" justifyContent="space-between">
                  <Typography fontWeight={700} color={theme.palette.info.light}>
                    {newLockBoost.toFixed(2)}x
                  </Typography>
                  <Typography>-{Number(cleanedAmount).toFixed(0)} SAFE</Typography>
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
  )
}
