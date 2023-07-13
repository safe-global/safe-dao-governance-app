import { Tooltip, Typography } from '@mui/material'
import { formatEther } from 'ethers/lib/utils'
import type { ReactElement } from 'react'

import { formatAmount } from '@/utils/formatters'
import { ExternalLink } from '@/components/ExternalLink'
import { InfoBox } from '@/components/InfoBox'
import { Sep5DeadlineChip } from '@/components/Sep5DeadlineChip'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { getVestingTypes } from '@/utils/vesting'
import { SEP5_EXPIRATION_DATE, SEP5_PROPOSAL_URL } from '@/config/constants'

export const Sep5InfoBox = (): ReactElement | null => {
  const { data: allocation } = useSafeTokenAllocation()
  const { sep5Vesting } = getVestingTypes(allocation?.vestingData || [])

  if (!sep5Vesting) {
    return null
  }

  return (
    <InfoBox display="flex" alignItems="center" justifyContent="space-between">
      <div>
        <Typography variant="body2" color="text.secondary">
          As a result of{' '}
          <ExternalLink href={SEP5_PROPOSAL_URL} icon={false}>
            SEP #5
          </ExternalLink>
          , you qualify for
        </Typography>
        <Typography fontWeight={700}>{formatAmount(formatEther(sep5Vesting.amount), 2)} SAFE</Typography>
      </div>
      <Tooltip
        title={`Initiate at least one claiming transaction before ${SEP5_EXPIRATION_DATE}`}
        arrow
        placement="top"
      >
        <span>
          <Sep5DeadlineChip px={2} />
        </span>
      </Tooltip>
    </InfoBox>
  )
}
