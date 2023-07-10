import { Grid, Typography, Box, Button, CircularProgress } from '@mui/material'
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
    <Grid container p={7} alignItems="center" justifyContent="center" gap={4}>
      <Grid item xs={12} px={3}>
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          <Grid item xs={6} display="flex" flexDirection="column" alignItems="center">
            <SafeToken alt="Safe Token logo" width={84} height={84} />

            <Box mt={4} display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <TotalVotingPower />
            </Box>
          </Grid>

          {hasAllocation && (
            <Grid item xs={6} display="flex" gap={2} flexDirection="column">
              <InfoBox className={css.overview}>
                <Typography variant="body2" color="text.secondary">
                  Claimable now
                </Typography>
                <Typography fontWeight={700}>{formatAmount(formatEther(total.claimable), 2)} SAFE</Typography>
              </InfoBox>
              <InfoBox className={css.overview}>
                <Typography variant="body2" color="text.secondary">
                  Claimable in the future
                </Typography>
                <Typography fontWeight={700}>{formatAmount(formatEther(total.inVesting), 2)} SAFE</Typography>
              </InfoBox>
            </Grid>
          )}

          {canRedeemSep5 && (
            <Grid item xs={12}>
              <Sep5InfoBox />
            </Grid>
          )}

          {isClaimable && (
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button variant="contained" size="stretched" onClick={onClaim} disabled={isWrongChain}>
                Claim Safe Tokens
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <SelectedDelegate delegate={delegate || undefined} action={action} shortenAddress hint />
      </Grid>

      <Grid item xs={12}>
        <OverviewLinks />
      </Grid>
    </Grid>
  )
}
