import { FAKE_NOW } from '@/hooks/useLockHistory'
import { AccessTime } from '@mui/icons-material'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { SEASON2_START } from './BoostGraph/graphConstants'

export const BoostMeter = () => {
  const value = ((SEASON2_START - FAKE_NOW) / SEASON2_START) * 100

  return (
    <Stack direction="row" spacing={2} height="100%" alignItems="flex-end">
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: '100%',
          border: ({ palette }) => `4px solid ${palette.border.light}`,
          padding: '2px',
          borderRadius: '8px',
          backgroundColor: ({ palette }) => palette.border.main,

          '& .MuiLinearProgress-bar': {
            borderRadius: '6px',

            transform: () => {
              return `translateY(${100 - value}%) !important`
            },
          },
        }}
      />
      <Box>
        <AccessTime fontSize="small" />
        <Typography variant="subtitle2" fontWeight={700}>
          Early boost meter
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The boost decreases over time.
        </Typography>
      </Box>
    </Stack>
  )
}
