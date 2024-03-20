import { Grid, Typography, Box, Button, CircularProgress, Stack, Paper, Link } from '@mui/material'
import { useRouter } from 'next/router'
import { formatEther } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'
import type { ReactElement } from 'react'

import { OverviewLinks } from '@/components/OverviewLinks'
import { useDelegate } from '@/hooks/useDelegate'
import { SelectedDelegate } from '@/components/SelectedDelegate'
import { AppRoutes } from '@/config/routes'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { TotalVotingPower } from '@/components/TotalVotingPower'
import { formatAmount } from '@/utils/formatters'
import { useTaggedAllocations } from '@/hooks/useTaggedAllocations'
import { useIsWrongChain } from '@/hooks/useIsWrongChain'
import SafeToken from '@/public/images/token.svg'
import { getGovernanceAppSafeAppUrl } from '@/utils/safe-apps'
import { useChainId } from '@/hooks/useChainId'
import { useWallet } from '@/hooks/useWallet'
import { isSafe } from '@/utils/wallet'
import { InfoBox } from '@/components/InfoBox'
import { useIsDelegationPending } from '@/hooks/usePendingDelegations'
import { Sep5InfoBox } from '@/components/Sep5InfoBox'
import ClaimOverview from '@/components/Claim'
import PaperContainer from '@/components/PaperContainer'
import { canRedeemSep5Airdrop } from '@/utils/airdrop'

import css from './styles.module.css'

export const Intro = (): ReactElement => {
  const router = useRouter()
  const isWrongChain = useIsWrongChain()
  const wallet = useWallet()
  const chainId = useChainId()

  const delegate = useDelegate()

  const { isLoading, data: allocation } = useSafeTokenAllocation()
  const { total } = useTaggedAllocations()

  const canRedeemSep5 = canRedeemSep5Airdrop(allocation)

  const hasAllocation = Number(total.allocation) > 0
  const isClaimable = Number(total.claimable) > 0

  const isDelegating = useIsDelegationPending()
  const canDelegate =
    !isDelegating && !!allocation?.votingPower && BigNumber.from(allocation.votingPower).gt(0) && !isWrongChain

  const onClick = (route: (typeof AppRoutes)[keyof typeof AppRoutes]) => async () => {
    // Safe is connected via WC
    if (wallet && (await isSafe(wallet))) {
      window.open(getGovernanceAppSafeAppUrl(chainId, wallet.address), '_blank')?.focus()
    } else {
      router.push(route)
    }
  }

  const onClaim = onClick(AppRoutes.claim)

  const onDelegate = onClick(AppRoutes.delegate)

  const onLock = onClick(AppRoutes.activity)

  const action = (
    <Button variant="contained" size="stretched" onClick={onDelegate} disabled={!canDelegate}>
      {delegate ? 'Redelegate' : 'Delegate'}
    </Button>
  )

  if (isLoading) {
    return (
      <Grid container display="flex" justifyContent="center" py={42}>
        <CircularProgress />
      </Grid>
    )
  }
  return (
    <Grid container spacing={3} direction="row">
      <Grid item xs={12} mb={3}>
        <Typography variant="h2">Claim SAFE tokens and engage in governance</Typography>
      </Grid>

      <Grid item xs={8}>
        <Stack spacing={3}>
          <ClaimOverview />

          <PaperContainer>
            <Typography variant="h6" fontWeight={700}>
              Delegate your voting power
            </Typography>
            <Grid item xs={12}>
              <SelectedDelegate delegate={delegate || undefined} action={action} shortenAddress hint />
            </Grid>
          </PaperContainer>
        </Stack>
      </Grid>

      <Grid item xs={4}>
        <PaperContainer>
          <Box my={10} textAlign="center">
            <SafeToken alt="Safe Token logo" width={84} height={84} />

            <Box mt={4} display="flex" flexDirection="column">
              <Typography>Total voting power is</Typography>
              <TotalVotingPower />
            </Box>
          </Box>
          <OverviewLinks></OverviewLinks>
        </PaperContainer>
      </Grid>
    </Grid>
  )
}
