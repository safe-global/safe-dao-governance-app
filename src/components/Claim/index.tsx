import {
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  Tooltip,
  Stack,
  SvgIcon,
  Divider,
  TextField,
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import { useState, type ReactElement, ChangeEvent } from 'react'

import PaperContainer from '../PaperContainer'
import { TotalVotingPower } from '../TotalVotingPower'
import { InfoOutlined } from '@mui/icons-material'
import TitleStar from '@/public/images/leaderboard-title-star.svg'
import { maxDecimals, minMaxValue, mustBeFloat } from '@/utils/validation'
import { useIsTokenPaused } from '@/hooks/useIsTokenPaused'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { useTaggedAllocations } from '@/hooks/useTaggedAllocations'
import { getVestingTypes } from '@/utils/vesting'
import { formatEther } from 'ethers/lib/utils'
import { createClaimTxs } from '@/utils/claim'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { useIsWrongChain } from '@/hooks/useIsWrongChain'
import SafeToken from '@/public/images/token.svg'

import css from './styles.module.css'
import { useRouter } from 'next/router'
import { AppRoutes } from '@/config/routes'

const validateAmount = (amount: string, maxAmount: string) => {
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

  const [amount, setAmount] = useState('')
  const [isMaxAmountSelected, setIsMaxAmountSelected] = useState(false)
  const [amountError, setAmountError] = useState<string>()
  const [creatingTxs, setCreatingTxs] = useState(false)

  const { data: isTokenPaused } = useIsTokenPaused()

  // Allocation, vesting and voting power
  const { data: allocation } = useSafeTokenAllocation()

  const { investorVesting } = getVestingTypes(allocation?.vestingData ?? [])

  const { sep5, user, investor, total } = useTaggedAllocations()
  const totalClaimableAmountInEth = formatEther(total.claimable)

  // Flags
  const isInvestorClaimingDisabled = !!investorVesting && isTokenPaused

  const isAmountGTZero = !!amount && !amountError && Number.parseFloat(amount) > 0

  const isClaimDisabled =
    !isAmountGTZero || (isInvestorClaimingDisabled && isAmountGTZero) || !!amountError || creatingTxs || isWrongChain

  // Handlers
  const onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const error = validateAmount(amount || '0', totalClaimableAmountInEth)
    setAmount(event.target.value)
    setAmountError(error)

    setIsMaxAmountSelected(false)
  }

  const onClaim = async () => {
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
  }

  const setToMaxAmount = () => {
    const amountAsNumber = Number(formatEther(total.claimable))
    setAmount(amountAsNumber.toFixed(2))
    setAmountError(undefined)

    setIsMaxAmountSelected(true)
  }

  return (
    <PaperContainer>
      <Grid container spacing={3} direction="row" justifyContent="space-evenly">
        <Grid item xs={6}>
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
            <Typography variant="subtitle1" fontWeight={700}>
              Claim now
            </Typography>
            <Box display="inline-flex" gap={1} alignItems="center">
              <Typography color="#B2BBC0" variant="body2" fontWeight={700}>
                Total
              </Typography>
              <ShieldOutlinedIcon fontSize="small" />
            </Box>
            <TotalVotingPower />
          </Paper>
        </Grid>
        <Grid item xs={6}>
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
            <Typography variant="subtitle1" fontWeight={700}>
              Claim at the end of the season
              <Tooltip title={<Typography>tbd</Typography>} arrow placement="top">
                <InfoOutlined
                  sx={{
                    height: '16px',
                    width: '16px',
                    mb: '-2px',
                    ml: 1,
                    color: 'var(--mui-palette-border-main)',
                  }}
                />
              </Tooltip>
            </Typography>
            <Box display="inline-flex" gap={1} alignItems="center">
              <Typography color="#B2BBC0" variant="body2" fontWeight={700}>
                Total
              </Typography>
              <ShieldOutlinedIcon fontSize="small" />
            </Box>
            <TotalVotingPower />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              <InfoOutlined
                sx={{
                  height: '16px',
                  width: '16px',
                  mb: '-2px',
                  mr: 1,
                }}
              />
              Total awarded allocation is{' '}
              <Typography variant="body2" display="inline" color="text.primary">
                10.000,15 SAFE
              </Typography>
            </Typography>
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
              <Stack direction="row" spacing={2} alignItems="center">
                <SvgIcon fontSize="large" component={TitleStar} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Claim your tokens as rewards
                  </Typography>
                  <Typography variant="body2">You get more tokens if you are active in activity program.</Typography>
                </Box>
              </Stack>
            </Paper>
            <Divider />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                How much do you want to claim?
              </Typography>
              <Typography color="text.secondary" variant="body1">
                Select all tokens or define a custom amount.
              </Typography>
            </Box>
            <Box display="inline-flex" gap={2}>
              <TextField
                variant="outlined"
                value={amount}
                error={!!amountError}
                helperText={amountError}
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
              <Button variant="contained" onClick={onClaim} disableElevation disabled={isClaimDisabled}>
                {creatingTxs ? <CircularProgress size={20} /> : 'Claim'}
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </PaperContainer>
  )
}

export default ClaimOverview
