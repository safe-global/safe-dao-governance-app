import { Typography } from '@mui/material'
import { formatEther } from 'ethers/lib/utils'
import type { ReactElement } from 'react'

import { useVotingPower } from '@/hooks/useVotingPower'
import { formatAmount } from '@/utils/formatters'

export const TotalVotingPower = (): ReactElement => {
  const { data } = useVotingPower()
  const votingPower = data ? Number(formatEther(data)) : 0
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
