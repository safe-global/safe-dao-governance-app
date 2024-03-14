import { Box, Paper, Typography } from '@mui/material'
import type { ReactElement } from 'react'

import { AccessTime } from '@mui/icons-material'

export const StartDateCard = ({ date }: { date: string }): ReactElement => {
  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: ({ palette }) => palette.background.default,
        color: ({ palette }) => palette.text.primary,
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 1,
        alignItems: 'center',
        mt: 2,
      }}
    >
      <Typography variant="overline" color="primary.light">
        Starting
      </Typography>
      <Box display="flex" alignItems="center">
        <AccessTime fontSize="small" />
        <Typography ml={1} fontWeight={700}>
          {date}
        </Typography>
      </Box>
    </Paper>
  )
}
