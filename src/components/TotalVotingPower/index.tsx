import { Typography } from '@mui/material'
import { formatEther } from 'ethers/lib/utils'
import type { ReactElement } from 'react'

import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { formatAmount } from '@/utils/formatters'

export const TotalVotingPower = (): ReactElement => {
  const { data: allocation } = useSafeTokenAllocation()
  const votingPower = allocation?.votingPower ? Number(formatEther(allocation.votingPower)) : 0
  const formattedAmount = formatAmount(votingPower, 2)

  return (
    <>
      <Typography variant="h3" fontWeight={700} mt={0.5}>
        {formattedAmount} SAFE
      </Typography>
    </>
  )
}
