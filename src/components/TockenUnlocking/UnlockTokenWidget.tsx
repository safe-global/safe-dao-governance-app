import SafeToken from '@/public/images/token.svg'
import css from './styles.module.css'
import { Stack, Grid, Typography, TextField, InputAdornment, Button, CircularProgress, Box } from '@mui/material'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { createUnlockTx } from '@/utils/lock'
import { useState, useMemo, ChangeEvent, useCallback, useEffect } from 'react'
import { BigNumber, BigNumberish } from 'ethers'
import { useChainId } from '@/hooks/useChainId'
import Track from '../Track'
import { LOCK_EVENTS } from '@/analytics/lockEvents'
import { trackSafeAppEvent } from '@/utils/analytics'
import { useTxSender } from '@/hooks/useTxSender'

export const UnlockTokenWidget = ({ currentlyLocked }: { currentlyLocked: BigNumberish }) => {
  const [unlockAmount, setUnlockAmount] = useState('0')

  const [unlockAmountError, setUnlockAmountError] = useState<string>()

  const [isUnlocking, setIsUnlocking] = useState(false)

  const chainId = useChainId()
  const txSender = useTxSender()

  const debouncedAmount = useDebounce(unlockAmount, 1000, '0')
  const cleanedAmount = useMemo(() => (debouncedAmount.trim() === '' ? '0' : debouncedAmount.trim()), [debouncedAmount])

  useEffect(() => {
    if (debouncedAmount !== '0') {
      trackSafeAppEvent(LOCK_EVENTS.CHANGE_UNLOCK_AMOUNT.action, LOCK_EVENTS.CHANGE_UNLOCK_AMOUNT.label)
    }
  }, [debouncedAmount])

  const validateAmount = useCallback(
    (newAmount: string) => {
      const numberAmount = Number(newAmount)
      if (isNaN(numberAmount)) {
        return 'The value must be a number'
      }
      const parsed = parseUnits(numberAmount.toString(), 18)
      if (parsed.gt(currentlyLocked ?? '0')) {
        return 'Amount exceeds your locked tokens.'
      }

      if (parsed.lte(0)) {
        return 'Amount must be greater than zero'
      }
    },
    [currentlyLocked],
  )

  const onChangeUnlockAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replaceAll(',', '.')
    const error = validateAmount(newValue || '0')
    setUnlockAmount(newValue)
    setUnlockAmountError(error)
  }

  const onSetToMax = useCallback(() => {
    if (!currentlyLocked || BigNumber.from(currentlyLocked).eq(0)) {
      return
    }
    setUnlockAmount(formatUnits(currentlyLocked, 18))
    setUnlockAmountError(undefined)
  }, [currentlyLocked])

  const onUnlock = async () => {
    setIsUnlocking(true)
    const unlockTx = createUnlockTx(chainId, parseUnits(unlockAmount, 18))
    try {
      await txSender?.sendTxs([unlockTx])
      trackSafeAppEvent(LOCK_EVENTS.UNLOCK_SUCCESS.action)
      setUnlockAmount('0')
    } catch (err) {
      console.error(err)
    }
    setIsUnlocking(false)
  }

  const isDisabled = !txSender || Boolean(unlockAmountError) || isUnlocking || cleanedAmount === '0'

  return (
    <>
      <Box display="flex" flex="1" alignItems="flex-start" flexDirection="column" gap={1}>
        <Typography variant="h4" fontSize="27px" fontWeight={700}>
          Unlock
        </Typography>
        <Typography variant="body1">Unlocked tokens can be withdrawn 24 hours after unlocking.</Typography>
      </Box>
      <Stack
        spacing={3}
        className={css.bordered}
        sx={{
          padding: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography>Select amount to unlock</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={unlockAmount}
              helperText={unlockAmountError ?? ' '}
              error={Boolean(unlockAmountError)}
              onChange={onChangeUnlockAmount}
              onFocus={(event) => {
                event.target.select()
              }}
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
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Track {...LOCK_EVENTS.UNLOCK_BUTTON}>
              <Button onClick={onUnlock} variant="contained" fullWidth disableElevation disabled={isDisabled}>
                {isUnlocking ? <CircularProgress size={20} /> : 'Unlock'}
              </Button>
            </Track>
          </Grid>
        </Grid>
      </Stack>
    </>
  )
}
