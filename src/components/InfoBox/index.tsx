import clsx from 'clsx'
import { Box } from '@mui/system'
import type { BoxProps } from '@mui/system'
import type { ReactElement } from 'react'

import css from './styles.module.css'

export const InfoBox = ({ className, ...props }: BoxProps): ReactElement => {
  return <Box className={clsx(css.container, className)} {...props} />
}
