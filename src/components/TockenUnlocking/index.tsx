import { formatAmount } from '@/utils/formatters'
import { InfoOutlined } from '@mui/icons-material'
import { Box, Button, Grid, InputAdornment, Link, Paper, Skeleton, TextField, Tooltip, Typography } from '@mui/material'
import { Odometer } from '../Odometer'
import css from './styles.module.css'
import SafeToken from '@/public/images/token.svg'
import { ChangeEvent, useState } from 'react'
import NextLink from 'next/link'
import { AppRoutes } from '@/config/routes'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { createUnlockTx, createWithdrawTx } from '@/utils/lock'
import { useChainId } from '@/hooks/useChainId'
import { useSafeUserLockingInfos } from '@/hooks/useSafeTokenBalance'
import { timeRemaining } from '@/utils/date'

const TokenUnlocking = () => {
  const { isLoading: userLockingInfosLoading, data: userLockingInfos } = useSafeUserLockingInfos()
  const { sdk } = useSafeAppsSDK()
  const chainId = useChainId()

  const currentlyLocked = userLockingInfos?.lockedAmount ?? BigNumber.from(0)
  const unlockedTotal = userLockingInfos?.totalUnlockedAmount ?? BigNumber.from(0)
  const nextUnlock = userLockingInfos?.nextUnlock
  const unlockedReady = nextUnlock?.isUnlocked ? nextUnlock.unlockAmount : BigNumber.from(0)
  const nextUnlockAmount = nextUnlock ? Number(formatUnits(nextUnlock?.unlockAmount, 18)) : 0

  const timeToUnlock =
    nextUnlock?.isUnlocked || !nextUnlock ? undefined : timeRemaining(nextUnlock.unlockedAt.toNumber())

  const [unlockAmount, setUnlockAmount] = useState('0')
  const [unlockAmountError, setUnlockAmountError] = useState<string>()

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

  const onUnlock = async () => {
    const unlockTx = createUnlockTx(chainId, parseUnits(unlockAmount, 18))
    await sdk.txs.send({ txs: [unlockTx] })
  }

  const onWithdraw = async () => {
    const withdrawTx = createWithdrawTx(chainId)
    await sdk.txs.send({ txs: [withdrawTx] })
  }

  return (
    <Grid container p={6} spacing={3}>
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: ({ palette }) => palette.primary.main,
              color: ({ palette }) => palette.background.default,
              position: 'relative',
            }}
          >
            <Typography fontWeight={700}>Locked</Typography>

            <Grid item display="flex" alignItems="center">
              <Typography
                variant="h3"
                variantMapping={{
                  h3: 'span',
                }}
                className={css.amountDisplay}
              >
                {userLockingInfosLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    <Odometer value={Number(formatUnits(currentlyLocked, 18))} decimals={2} /> SAFE
                  </>
                )}
              </Typography>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Grid item container gap={2} flexWrap="nowrap" xs={12} mb={1}>
            <Grid item xs={9}>
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
                      <button className={css.maxButton}>Max</button>
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
                disabled={Boolean(unlockAmountError)}
              >
                Unlock
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: ({ palette }) => palette.background.default,
              color: ({ palette }) => palette.text.primary,
              position: 'relative',
            }}
          >
            <Typography fontWeight={700}>
              Unlocked (pending)
              {timeToUnlock && (
                <Tooltip
                  title={
                    <Typography>
                      Next unlock: {nextUnlockAmount} SAFE will become withdrawable in{' '}
                      {timeToUnlock.days > 0 && `${timeToUnlock.days} days`}
                      {timeToUnlock.hours > 0 && `${timeToUnlock.hours} hours`}
                      {timeToUnlock.minutes > 0 && `${timeToUnlock.minutes} minutes`}
                    </Typography>
                  }
                  arrow
                  placement="top"
                >
                  <InfoOutlined
                    sx={{
                      height: '16px',
                      width: '16px',
                      mb: '-2px',
                      ml: 1,
                    }}
                  />
                </Tooltip>
              )}
            </Typography>

            <Grid item display="flex" alignItems="center">
              <Typography
                variant="h3"
                variantMapping={{
                  h3: 'span',
                }}
                className={css.amountDisplay}
              >
                <Odometer value={Number(formatUnits(unlockedTotal.sub(unlockedReady), 18))} decimals={2} /> SAFE
              </Typography>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: ({ palette }) => palette.primary.main,
              color: ({ palette }) => palette.background.default,
              position: 'relative',
            }}
          >
            <Typography fontWeight={700}>Unlocked (witdrawable)</Typography>

            <Grid item display="flex" alignItems="center">
              <Typography
                variant="h3"
                variantMapping={{
                  h3: 'span',
                }}
                className={css.amountDisplay}
              >
                <Odometer value={Number(formatUnits(unlockedReady, 18))} decimals={2} /> SAFE
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Box>
          <Button variant="contained" color="primary" onClick={onWithdraw} disabled={unlockedReady.eq(0)}>
            Withdraw
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} justifyContent="right">
        <Link href={AppRoutes.activity} component={NextLink}>
          Back to locking
        </Link>
      </Grid>
    </Grid>
  )
}

export default TokenUnlocking
