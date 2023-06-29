import { Typography } from '@mui/material'
import type { TypographyProps } from '@mui/material'
import type { ReactElement } from 'react'

import css from './styles.module.css'

export const TypographyChip = ({ children, ...props }: TypographyProps): ReactElement => {
  return (
    <Typography variant="body2" className={css.chip} py={0.5} {...props}>
      {children}
    </Typography>
  )
}
