import { NOW_DAYS } from '@/hooks/useLockHistory'
import { useTheme } from '@mui/material/styles'
import SafeToken from '@/public/images/token.svg'
import { floorNumber, getBoostFunction, getTimeFactor, getTokenBoost } from '@/utils/boost'
import { formatAmount } from '@/utils/formatters'
import css from './styles.module.css'
import {
  Box,
  Stack,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import BoostCounter from '../BoostCounter'
import { BoostGraph } from '../TokenLocking/BoostGraph/BoostGraph'
import { useDebounce } from '@/hooks/useDebounce'
import { createUnlockTx, LockHistory } from '@/utils/lock'
import { useState, useMemo, ChangeEvent, useCallback } from 'react'
import { BigNumberish } from 'ethers'
import { useChainId } from '@/hooks/useChainId'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Info, InfoOutlined } from '@mui/icons-material'

export const UnlockTokenWidget = ({
  lockHistory,
  currentlyLocked,
}: {
  lockHistory: LockHistory[]
  currentlyLocked: BigNumberish
}) => {
  const [unlockAmount, setUnlockAmount] = useState('0')
  const [unlockAmountError, setUnlockAmountError] = useState<string>()

  const [isUnlocking, setIsUnlocking] = useState(false)

  const chainId = useChainId()
  const { sdk } = useSafeAppsSDK()

  const debouncedAmount = useDebounce(unlockAmount, 1000, '0')
  const cleanedAmount = useMemo(() => (debouncedAmount.trim() === '' ? '0' : debouncedAmount.trim()), [debouncedAmount])

  const boostFunction = useMemo(() => {
    return getBoostFunction(NOW_DAYS, -Number(cleanedAmount), lockHistory)
  }, [cleanedAmount, lockHistory])
  const earlyBirdBoostFunction = useMemo(() => {
    return getBoostFunction(NOW_DAYS, -Number(cleanedAmount), lockHistory)
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
    setIsUnlocking(true)
    const unlockTx = createUnlockTx(chainId, parseUnits(unlockAmount, 18))

    try {
      await sdk.txs.send({ txs: [unlockTx] })
    } catch (err) {
      console.error(err)
    }
    setIsUnlocking(false)
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
              <Typography>Select amount to unlock</Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={unlockAmount}
                helperText={unlockAmountError ?? ' '}
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
            </Grid>

            <Grid item xs={4}>
              <Button
                onClick={onUnlock}
                variant="contained"
                fullWidth
                disableElevation
                disabled={Boolean(unlockAmountError) || isUnlocking || cleanedAmount === '0'}
              >
                {isUnlocking ? <CircularProgress size={20} /> : 'Unlock'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Box className={`${css.boostInfoBox} ${css.bordered}`} p={3} gap={4} display="flex">
            <Typography variant="body2">
              Already realized boost: {floorNumber(getBoostFunction(NOW_DAYS, 0, lockHistory)({ x: NOW_DAYS }), 2)}x
            </Typography>

            <Stack direction="column" width="100%" mt={2} alignItems="center">
              <BoostCounter value={newLockBoost + earlyBirdBoost} variant="h3" fontWeight={700} />
              <Typography variant="body2">Expected final boost</Typography>
            </Stack>

            <Divider sx={{ ml: '-16px', width: '100%', mr: '-16px' }} />

            <Stack direction="row" alignItems="center" spacing={2}>
              <InfoOutlined fontSize="small" />
              <Typography variant="body2">Your boost will change if you unlock</Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  )
}
