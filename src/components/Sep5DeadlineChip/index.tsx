import { SvgIcon } from '@mui/material'
import type { TypographyProps } from '@mui/material'
import type { ReactElement } from 'react'

import ClockIcon from '@/public/images/clock.svg'
import { TypographyChip } from '../TypographyChip'

export const Sep5DeadlineChip = (props: TypographyProps): ReactElement => {
  // TODO: Use real SEP #5 data
  const fakeSep5ClaimDate = '01.01.1970'

  return (
    <TypographyChip {...props}>
      <SvgIcon component={ClockIcon} inheritViewBox fontSize="inherit" sx={{ mr: '6px' }} />
      Until {fakeSep5ClaimDate}
    </TypographyChip>
  )
}
