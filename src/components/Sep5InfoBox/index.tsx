import type { ReactElement } from 'react'
import { Typography } from '@mui/material'

import { useMockSep5 } from '@/hooks/useMockSep5'
import { formatAmount } from '@/utils/formatters'
import { ExternalLink } from '@/components/ExternalLink'
import { InfoBox } from '@/components/InfoBox'
import { Sep5DeadlineChip } from '@/components/Sep5DeadlineChip'

const SEP5_URL =
  'https://snapshot.org/#/safe.eth/proposal/0xb4765551b4814b592d02ce67de05527ac1d2b88a8c814c4346ecc0c947c9b941'

export const Sep5InfoBox = (): ReactElement => {
  // TODO: Use real SEP #5 data
  const sep5 = useMockSep5()

  return (
    <InfoBox display="flex" alignItems="center" justifyContent="space-between">
      <div>
        <Typography variant="body2" color="text.secondary">
          As a result of{' '}
          <ExternalLink href={SEP5_URL} icon={false}>
            SEP #5
          </ExternalLink>
          , you qualify for
        </Typography>
        <Typography fontWeight={700}>{formatAmount(sep5.allocation, 2)} SAFE</Typography>
      </div>
      <Sep5DeadlineChip px={2} />
    </InfoBox>
  )
}
