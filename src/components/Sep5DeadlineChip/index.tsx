import { SvgIcon } from '@mui/material'
import type { TypographyProps } from '@mui/material'
import type { ReactElement } from 'react'

import ClockIcon from '@/public/images/clock.svg'
import { TypographyChip } from '../TypographyChip'
import { SEP5_EXPIRATION_DATE } from '@/config/constants'

export const Sep5DeadlineChip = (props: TypographyProps): ReactElement => {
  return (
    <TypographyChip {...props}>
      <SvgIcon component={ClockIcon} inheritViewBox fontSize="inherit" sx={{ mr: '6px' }} />
      Until {SEP5_EXPIRATION_DATE}
    </TypographyChip>
  )
}
