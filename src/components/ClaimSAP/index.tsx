import { Grid, Typography, Button, Paper, Box, Stack } from '@mui/material'
import { type ReactElement } from 'react'

import PaperContainer from '../PaperContainer'

import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { useTaggedAllocations } from '@/hooks/useTaggedAllocations'
import { getVestingTypes } from '@/utils/vesting'
import { formatEther } from 'ethers/lib/utils'
import { createSAPClaimTxs } from '@/utils/claim'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'

import css from './styles.module.css'
import { Odometer } from '@/components/Odometer'
import { formatDate } from '@/utils/date'

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

const ClaimSAPOverview = (): ReactElement => {
  const { sdk } = useSafeAppsSDK()

  // Allocation, vesting and voting power
  const { data: allocation } = useSafeTokenAllocation()
  const { sapBoosted, sapUnboosted, totalSAP } = useTaggedAllocations()
  const { sapBoostedVesting } = getVestingTypes(allocation?.vestingData ?? [])

  const startDate = sapBoostedVesting && new Date(sapBoostedVesting.startDate * 1000)
  const startDateFormatted = startDate && formatDate(startDate, true)

  const decimals = getDecimalLength(totalSAP.inVesting)

  const onRedeem = async () => {
    const txs = createSAPClaimTxs({
      vestingData: allocation?.vestingData ?? [],
      sapBoostedClaimable: sapBoosted.inVesting,
      sapUnboostedClaimable: sapUnboosted.inVesting,
    })

    try {
      await sdk.txs.send({ txs })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Grid container spacing={3} direction="row">
      <Grid item xs={12} mt={4} mb={1} className={css.pageTitle}>
        <Typography variant="h2">Claim SAFE tokens from the Safe Activity Rewards program</Typography>
      </Grid>

      <Grid item xs={12} lg={8}>
        <PaperContainer>
          <Grid container spacing={3} direction="row" justifyContent="space-evenly">
            <Grid item container xs={12}>
              <Paper sx={{ p: 3, backgroundColor: 'background.default', position: 'relative' }}>
                <Typography fontWeight="700">Your total allocation</Typography>
                <Grid item display="flex" alignItems="center">
                  <Typography
                    variant="h3"
                    variantMapping={{
                      h3: 'span',
                    }}
                    className={css.amountDisplay}
                  >
                    <Odometer value={Number(formatEther(totalSAP.allocation))} decimals={decimals} /> SAFE
                  </Typography>
                </Grid>
              </Paper>
            </Grid>
            <Grid item pt={2} xs={12}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" mt={2} fontWeight={700}>
                    Here are the next steps:
                  </Typography>
                  <Typography color="text.secondary" variant="body1">
                    Your allocation will be available to claim at {startDateFormatted}
                  </Typography>
                  <Typography color="text.secondary" variant="body1" mb={2}>
                    You will need to redeem the airdrop before then.
                  </Typography>
                  <Button variant="contained" onClick={onRedeem}>
                    Redeem
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </PaperContainer>
      </Grid>
    </Grid>
  )
}

export default ClaimSAPOverview
