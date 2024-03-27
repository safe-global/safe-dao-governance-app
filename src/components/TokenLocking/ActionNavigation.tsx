import { AppRoutes } from '@/config/routes'

import { Typography, Stack, Button, Box } from '@mui/material'
import { useRouter } from 'next/router'

import css from './styles.module.css'

export const ActionNavigation = () => {
  const router = useRouter()

  const onNavigate = (route: (typeof AppRoutes)[keyof typeof AppRoutes]) => async () => {
    router.push(route)
  }

  const onUnlockAndWithdraw = onNavigate(AppRoutes.unlock)
  return (
    <Stack>
      <Box className={`${css.bordered}`} display="flex" justifyContent="space-between" alignItems="center" padding={3}>
        <Typography variant="subtitle1" fontWeight={700}>
          Remove SAFE from locking
        </Typography>

        <Button variant="outlined" color="primary" onClick={onUnlockAndWithdraw} sx={{ borderWidth: '1px !important' }}>
          <Box display="flex" alignItems="center">
            <Box>Unlock/Withdraw</Box>
          </Box>
        </Button>
      </Box>
    </Stack>
  )
}
