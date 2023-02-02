import { Typography, Skeleton } from '@mui/material'
import { formatEther } from 'ethers/lib/utils'
import type { ReactElement } from 'react'

import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { formatAmount } from '@/utils/formatters'

export const TotalVotingPower = (): ReactElement => {
  const { data } = useSafeTokenAllocation()
  const votingPower = data?.votingPower ? Number(formatEther(data.votingPower)) : 0
  const formattedAmount = formatAmount(votingPower, 2)

  return (
    <>
      <Typography color="text.secondary">Total voting power is</Typography>

      <Typography variant="h2" mt={0.5}>
        {formattedAmount} SAFE
      </Typography>
    </>
  )
}
