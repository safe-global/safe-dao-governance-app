import {
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  Stack,
  SvgIcon,
  Divider,
  TextField,
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import { useState, type ReactElement, ChangeEvent } from 'react'

import PaperContainer from '../PaperContainer'

import StarIcon from '@/public/images/star.svg'
import { maxDecimals, minMaxValue, mustBeFloat } from '@/utils/validation'
import { useIsTokenPaused } from '@/hooks/useIsTokenPaused'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { useTaggedAllocations } from '@/hooks/useTaggedAllocations'
import { getVestingTypes } from '@/utils/vesting'
import { formatEther } from 'ethers/lib/utils'
import { createClaimTxs } from '@/utils/claim'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { useIsWrongChain } from '@/hooks/useIsWrongChain'
import SafeToken from '@/public/images/token.svg'

import css from './styles.module.css'
import { useRouter } from 'next/router'
import { AppRoutes } from '@/config/routes'
import { formatAmount } from '@/utils/formatters'
import { ClaimCard } from '../ClaimCard'
import { InfoAlert } from '../InfoAlert'
import { useWallet } from '@/hooks/useWallet'
import { isSafe } from '@/utils/wallet'
import { getGovernanceAppSafeAppUrl } from '@/utils/safe-apps'
import { useChainId } from '@/hooks/useChainId'

const validateAmount = (amount: string, maxAmount: string) => {
  if (isNaN(Number(amount))) {
    return 'The value must be a number'
  }
  return mustBeFloat(amount) || minMaxValue(0, maxAmount, amount) || maxDecimals(amount, 18)
}

const getDecimalLength = (amount: string) => {
  const length = Number(amount).toFixed(2).length

  if (length > 10) {
    return 0
  }

  if (length > 9) {
    return 1
  }

  return 2
}

const ClaimOverview = (): ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const isWrongChain = useIsWrongChain()
  const router = useRouter()
  const wallet = useWallet()
  const chainId = useChainId()

  const [amount, setAmount] = useState('0')
  const [isMaxAmountSelected, setIsMaxAmountSelected] = useState(false)
  const [amountError, setAmountError] = useState<string>()
  const [creatingTxs, setCreatingTxs] = useState(false)

  const { data: isTokenPaused } = useIsTokenPaused()

  // Allocation, vesting and voting power
  const { data: allocation } = useSafeTokenAllocation()

  const { ecosystemVesting, investorVesting } = getVestingTypes(allocation?.vestingData ?? [])

  const { sep5, user, ecosystem, investor, total } = useTaggedAllocations()
  const totalClaimableAmountInEth = formatEther(total.claimable)

  const decimals = getDecimalLength(total.inVesting)

  // Flags
  const isInvestorClaimingDisabled = !!investorVesting && isTokenPaused

  const isAmountGTZero = !!amount && !amountError && Number.parseFloat(amount) > 0

  const isClaimDisabled =
    !isAmountGTZero || (isInvestorClaimingDisabled && isAmountGTZero) || !!amountError || creatingTxs || isWrongChain

  // Handlers
  const onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const error = validateAmount(event.target.value || '0', totalClaimableAmountInEth)
    setAmount(event.target.value)
    setAmountError(error)

    setIsMaxAmountSelected(false)
  }

  const onClick = (handler: () => Promise<void>) => async () => {
    // Safe is connected via WC
    if (wallet && (await isSafe(wallet))) {
      window.open(getGovernanceAppSafeAppUrl(chainId, wallet.address), '_blank')?.focus()
    } else {
      handler()
    }
  }

  const onClaim = onClick(async () => {
    setCreatingTxs(true)

    const txs = createClaimTxs({
      vestingData: allocation?.vestingData ?? [],
      safeAddress: safe.safeAddress,
      isMax: isMaxAmountSelected,
      amount: amount || '0',
      sep5Claimable: sep5.claimable,
      userClaimable: user.claimable,
      investorClaimable: investor.claimable,
      isTokenPaused: !!isTokenPaused,
    })

    try {
      await sdk.txs.send({ txs })
      router.push({ pathname: AppRoutes.claim, query: { claimedAmount: amount } })
      setCreatingTxs(false)
    } catch (error) {
      console.error(error)
      setCreatingTxs(false)
    }
  })

  const setToMaxAmount = () => {
    const amountAsNumber = Number(formatEther(total.claimable))
    setAmount(amountAsNumber.toFixed(2))
    setAmountError(undefined)

    setIsMaxAmountSelected(true)
  }

  return (
    <PaperContainer>
      <Grid container spacing={3} direction="row" justifyContent="space-evenly">
        <Grid item container xs={12} spacing={3}>
          <Grid item xs={12} sm={6}>
            <ClaimCard
              variant="claimable"
              isGuardian={!!ecosystemVesting}
              totalAmount={total.claimable}
              ecosystemAmount={ecosystem.claimable}
              decimals={decimals}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ClaimCard
              variant="vesting"
              isGuardian={!!ecosystemVesting}
              totalAmount={total.inVesting}
              ecosystemAmount={ecosystem.inVesting}
              decimals={decimals}
            />
          </Grid>
        </Grid>
        <Grid item pt={2} xs={12}>
          <Stack spacing={3}>
            <InfoAlert>
              <Typography variant="body2" color="text.secondary">
                Total awarded allocation is{' '}
                <Typography component="span" variant="inherit" color="text.primary">
                  {formatAmount(formatEther(total.allocation), 2)} SAFE
                </Typography>
              </Typography>
            </InfoAlert>

            <Paper
              sx={{
                p: 3,
                backgroundColor: ({ palette }) => palette.background.default,
                color: ({ palette }) => palette.text.primary,
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" fontSize={38}>
                <SvgIcon component={StarIcon} inheritViewBox fontSize="inherit" />
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Claim your tokens as rewards!
                  </Typography>
                  <Typography variant="body2">You get more tokens if you are active in activity program.</Typography>
                </Box>
              </Stack>
            </Paper>

            <Divider />

            <Box>
              <Typography variant="h6" mt={2} fontWeight={700}>
                How much do you want to claim?
              </Typography>
              <Typography color="text.secondary" variant="body1">
                Select all tokens or define a custom amount.
              </Typography>
            </Box>

            <Grid item container gap={3} flexWrap="nowrap" xs={12} mb={1}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={amount}
                  error={!!amountError}
                  helperText={amountError ?? ' '}
                  onChange={onChangeAmount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ width: '24px', height: '24px' }}>
                        <SafeToken />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <button onClick={setToMaxAmount} className={css.maxButton}>
                          Max
                        </button>
                      </InputAdornment>
                    ),
                  }}
                  className={css.input}
                />
              </Grid>

              <Grid item xs={2}>
                <Button variant="contained" fullWidth onClick={onClaim} disableElevation disabled={isClaimDisabled}>
                  {creatingTxs ? <CircularProgress size={20} /> : 'Claim'}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </PaperContainer>
  )
}

export default ClaimOverview
