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
import { CHAIN_SHORT_NAME, SAFE_URL, DEPLOYMENT_URL } from '@/config/constants'
import { useChainId } from '@/hooks/useChainId'
import { useWallet } from '@/hooks/useWallet'
import { isSafe } from '@/utils/wallet'
import { InfoBox } from '@/components/InfoBox'
import { useIsDelegationPending } from '@/hooks/usePendingDelegations'

import css from './styles.module.css'

const getSafeAppUrl = (chainId: number, address: string): string => {
  const shortName = CHAIN_SHORT_NAME[chainId]

  const url = new URL(`${SAFE_URL}/apps`)

  url.searchParams.append('safe', `${shortName}:${address}`)
  url.searchParams.append('appUrl', DEPLOYMENT_URL)

  return url.toString()
}

export const Intro = (): ReactElement => {
  const router = useRouter()
  const isWrongChain = useIsWrongChain()
  const wallet = useWallet()
  const chainId = useChainId()

  const delegate = useDelegate()

  const { isLoading, data } = useSafeTokenAllocation()
  const { total } = useTaggedAllocations(data)

  const hasAllocation = Number(total.allocation) > 0
  const isClaimable = Number(total.claimable) > 0

  const isDelegating = useIsDelegationPending()
  const canDelegate = !isDelegating && !!data?.votingPower && BigNumber.from(data.votingPower).gt(0) && !isWrongChain

  const onClick = (route: (typeof AppRoutes)[keyof typeof AppRoutes]) => async () => {
    // Safe is connected via WC
    if (await isSafe(wallet)) {
      window.open(getSafeAppUrl(chainId, wallet!.address), '_blank')?.focus()
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
    <Grid container flexDirection="column" alignItems="center" px={1} py={6}>
      <SafeToken alt="Safe token logo" width={84} height={84} />

      <Box mt={4} display="flex" flexDirection="column" alignItems="center">
        <TotalVotingPower />
      </Box>

      {hasAllocation && (
        <Grid item xs={12} display="flex" gap={6} my={3} flexDirection={{ xs: 'column', sm: 'row' }}>
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

      {isClaimable && (
        <Button variant="contained" size="stretched" onClick={onClaim} disabled={isWrongChain}>
          Claim tokens
        </Button>
      )}

      <Grid item px={5} mt={6} mb={4}>
        <SelectedDelegate delegate={delegate || undefined} action={action} shortenAddress hint />
      </Grid>

      <Grid item xs={12}>
        <OverviewLinks />
      </Grid>
    </Grid>
  )
}
