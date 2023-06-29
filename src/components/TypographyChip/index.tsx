import { Typography } from '@mui/material'
import type { TypographyProps } from '@mui/material'
import type { ReactElement } from 'react'

import { useIsDarkMode } from '@/hooks/useIsDarkMode'

export const TypographyChip = ({ children, ...props }: TypographyProps): ReactElement => {
  const isDarkMode = useIsDarkMode()

  return (
    <Typography
      variant="body2"
      sx={(theme) => ({
        py: 0.5,
        bgcolor: isDarkMode ? theme.palette.primary.main : theme.palette.secondary.main,
        color: isDarkMode ? theme.palette.primary.contrastText : undefined,
        borderRadius: `${theme.shape.borderRadius}px`,
        display: 'flex',
        alignItems: 'center',
      })}
      {...props}
    >
      {children}
    </Typography>
  )
}
