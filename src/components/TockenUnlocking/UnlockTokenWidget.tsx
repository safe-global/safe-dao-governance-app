import SafeToken from '@/public/images/token.svg'
import { getBoostFunction } from '@/utils/boost'
import css from './styles.module.css'
import { Stack, Grid, Typography, TextField, InputAdornment, Button, CircularProgress, Box } from '@mui/material'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { BoostGraph } from '../TokenLocking/BoostGraph/BoostGraph'
import { useDebounce } from '@/hooks/useDebounce'
import { createUnlockTx, LockHistory } from '@/utils/lock'
import { useState, useMemo, ChangeEvent, useCallback, useEffect } from 'react'
import { BigNumber, BigNumberish } from 'ethers'
import { useChainId } from '@/hooks/useChainId'
import { getCurrentDays } from '@/utils/date'
import { SEASON2_START } from '@/config/constants'
import { BoostBreakdown } from '../TokenLocking/BoostBreakdown'
import Track from '../Track'
import { LOCK_EVENTS } from '@/analytics/lockEvents'
import { trackSafeAppEvent } from '@/utils/analytics'
import MilesReceipt from '@/components/TokenLocking/MilesReceipt'
import { useTxSender } from '@/hooks/useTxSender'
import { useStartDate } from '@/hooks/useStartDates'

export const UnlockTokenWidget = ({
  lockHistory,
  currentlyLocked,
}: {
  lockHistory: LockHistory[]
  currentlyLocked: BigNumberish
}) => {
  const [receiptOpen, setReceiptOpen] = useState<boolean>(false)
  const [receiptInformation, setReceiptInformation] = useState<{ newFinalBoost: number; amount: string }>({
    amount: '0',
    newFinalBoost: 1,
  })
  const [unlockAmount, setUnlockAmount] = useState('0')

  const [unlockAmountError, setUnlockAmountError] = useState<string>()

  const [isUnlocking, setIsUnlocking] = useState(false)

  const chainId = useChainId()
  const txSender = useTxSender()

  const { startTime } = useStartDate()
  const todayInDays = getCurrentDays(startTime)

  const debouncedAmount = useDebounce(unlockAmount, 1000, '0')
  const cleanedAmount = useMemo(() => (debouncedAmount.trim() === '' ? '0' : debouncedAmount.trim()), [debouncedAmount])

  useEffect(() => {
    if (debouncedAmount !== '0') {
      trackSafeAppEvent(LOCK_EVENTS.CHANGE_UNLOCK_AMOUNT.action, LOCK_EVENTS.CHANGE_UNLOCK_AMOUNT.label)
    }
  }, [debouncedAmount])

  const onCloseReceipt = () => {
    setUnlockAmount('0')
    setReceiptOpen(false)
  }

  const currentBoostFunction = useMemo(() => getBoostFunction(todayInDays, 0, lockHistory), [todayInDays, lockHistory])
  const newBoostFunction = useMemo(
    () => getBoostFunction(todayInDays, -Number(cleanedAmount), lockHistory),
    [cleanedAmount, lockHistory, todayInDays],
  )

  const onChangeUnlockAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replaceAll(',', '.')
    const error = validateAmount(newValue || '0')
    setUnlockAmount(newValue)
    setUnlockAmountError(error)
  }

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

  const onSetToMax = useCallback(() => {
    if (!currentlyLocked || BigNumber.from(currentlyLocked).eq(0)) {
      return
    }
    setUnlockAmount(formatUnits(currentlyLocked, 18))
  }, [currentlyLocked])

  const onUnlock = async () => {
    setIsUnlocking(true)
    const unlockTx = createUnlockTx(chainId, parseUnits(unlockAmount, 18))
    const newFinalBoost = newBoostFunction({ x: SEASON2_START })
    try {
      await txSender?.sendTxs([unlockTx])
      trackSafeAppEvent(LOCK_EVENTS.UNLOCK_SUCCESS.action)
      setReceiptInformation({ newFinalBoost, amount: unlockAmount })
      setUnlockAmount('0')
      setReceiptOpen(true)
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
        <Typography variant="body1">
          Unlocking tokens will result in reduced boost. Your unlocked tokens will be available in 24 hours.
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
          <Grid item xs={12} md={8}>
            <BoostGraph lockedAmount={-Number(cleanedAmount)} pastLocks={lockHistory} isLock={false} />

            <Grid item container spacing={2} xs={12} mb={1} alignItems="center">
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
                  className={css.input}
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
          </Grid>
          <Grid item xs={12} md={4}>
            <BoostBreakdown
              realizedBoost={currentBoostFunction({ x: todayInDays })}
              currentFinalBoost={currentBoostFunction({ x: SEASON2_START })}
              newFinalBoost={newBoostFunction({ x: SEASON2_START })}
              isLock={false}
            />
          </Grid>
        </Grid>
        <MilesReceipt
          open={receiptOpen}
          onClose={onCloseReceipt}
          amount={receiptInformation.amount}
          newFinalBoost={receiptInformation.newFinalBoost}
          isUnlock
        />
      </Stack>
    </>
  )
}
