import { Typography, Accordion, AccordionSummary, AccordionDetails, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import css from './styles.module.css'
import { ReactElement } from 'react'

export const AccordionContainer = ({ children, title }: { children: ReactElement; title: string }): ReactElement => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  if (!isSmallScreen) return <>{children}</>

  return (
    <Accordion className={css.container}>
      <AccordionSummary id="panel-header" aria-controls="panel-content" expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h4" fontWeight="bold" display="flex" alignItems="center">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}
