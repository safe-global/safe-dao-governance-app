import { Button, CircularProgress, Divider, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import SafeToken from '@/public/images/token.svg'
import { formatEther } from 'ethers/lib/utils'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import type { ChangeEvent, ReactElement } from 'react'

import { SelectedDelegate } from '@/components/SelectedDelegate'
import { maxDecimals, minMaxValue, mustBeFloat } from '@/utils/validation'
import { ClaimCard } from '@/components/ClaimCard'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { useDelegate } from '@/hooks/useDelegate'
import { InfoAlert } from '@/components/InfoAlert'
import { getVestingTypes } from '@/utils/vesting'
import { formatAmount } from '@/utils/formatters'
import { StepHeader } from '@/components/StepHeader'
import { createClaimTxs } from '@/utils/claim'
import { useIsTokenPaused } from '@/hooks/useIsTokenPaused'
import { useTaggedAllocations } from '@/hooks/useTaggedAllocations'
import { useIsWrongChain } from '@/hooks/useIsWrongChain'
import { Sep5InfoBox } from '@/components/Sep5InfoBox'
import { SEP5_EXPIRATION } from '@/config/constants'
import { canRedeemSep5Airdrop } from '@/utils/airdrop'
import type { ClaimFlow } from '@/components/Claim'

import css from './styles.module.css'

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

const ClaimOverview = ({ onNext }: { onNext: (data: ClaimFlow) => void }): ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const isWrongChain = useIsWrongChain()

  const [amount, setAmount] = useState('')
  const [isMaxAmountSelected, setIsMaxAmountSelected] = useState(false)
  const [amountError, setAmountError] = useState<string>()
  const [creatingTxs, setCreatingTxs] = useState(false)

  const delegate = useDelegate()

  const { data: isTokenPaused } = useIsTokenPaused()

  // Allocation, vesting and voting power
  const { data: allocation } = useSafeTokenAllocation()

  const { sep5Vesting, ecosystemVesting, investorVesting } = getVestingTypes(allocation?.vestingData ?? [])

  const { sep5, user, ecosystem, investor, total } = useTaggedAllocations()
  const totalClaimableAmountInEth = formatEther(total.claimable)

  const decimals = getDecimalLength(total.inVesting)

  // Flags
  const canRedeemSep5 = canRedeemSep5Airdrop(allocation)

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

  const setToMaxAmount = () => {
    const amountAsNumber = Number(formatEther(total.claimable))
    setAmount(amountAsNumber.toFixed(2))
    setAmountError(undefined)

    setIsMaxAmountSelected(true)
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

      onNext({ claimedAmount: amount })
    } catch (error) {
      console.error(error)
    }

    setCreatingTxs(false)
  }

  return (
    <Grid container p={6}>
      <Grid item xs={12} mb={3}>
        <StepHeader title="Your SAFE allocation:" />
      </Grid>

      <Grid item container xs={12} mb={1} spacing={3}>
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

      <InfoAlert>
        <Typography variant="body2">
          Total allocation is{' '}
          <Typography component="span" variant="inherit" color="text.primary">
            {formatAmount(formatEther(total.allocation), 2)} SAFE
          </Typography>
        </Typography>
      </InfoAlert>

      {canRedeemSep5 && (
        <>
          <Grid item xs={12} mt={2}>
            <Sep5InfoBox />
          </Grid>

          <Grid item xs={12} mt={1}>
            <InfoAlert>
              <Typography variant="body2">
                Execute at least one claim of any amount of your allocation before {SEP5_EXPIRATION} otherwise it will
                be transferred back to the Safe{`{DAO}`} treasury.
              </Typography>
            </InfoAlert>
          </Grid>
        </>
      )}

      <Grid item xs={12} my={4}>
        <Divider />
      </Grid>

      <Typography variant="h4" fontWeight={700}>
        How much do you want to claim?
      </Typography>
      <Typography variant="subtitle1" mb={2}>
        Select all Safe Tokens or define a custom amount.
      </Typography>

      <Grid item container gap={2} flexWrap="nowrap" xs={12} mb={1}>
        <Grid item xs={9}>
          <TextField
            variant="outlined"
            fullWidth
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
        </Grid>

        <Grid item xs={4}>
          <Button variant="contained" fullWidth onClick={onClaim} disableElevation disabled={isClaimDisabled}>
            {creatingTxs ? <CircularProgress size={20} /> : 'Claim'}
          </Button>
        </Grid>
      </Grid>

      {isInvestorClaimingDisabled && (
        <InfoAlert>
          <Typography variant="body2" mb={3}>
            Claiming will be available once the Safe Token is transferable
          </Typography>
        </InfoAlert>
      )}

      {delegate && (
        <Grid item xs={12}>
          <SelectedDelegate delegate={delegate} hint />
        </Grid>
      )}
    </Grid>
  )
}

export default ClaimOverview
