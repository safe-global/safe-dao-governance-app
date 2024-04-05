import { NAVIGATION_EVENTS } from '@/analytics/navigation'
import { AppRoutes } from '@/config/routes'
import { Typography, Stack, Button, Box } from '@mui/material'
import { useRouter } from 'next/router'
import Track from '../../../Track'
import clsx from 'clsx'

import css from './styles.module.css'

export const ActionNavigation = () => {
  const router = useRouter()

  const onNavigate = (route: (typeof AppRoutes)[keyof typeof AppRoutes]) => async () => {
    router.push(route)
  }

  const onUnlockAndWithdraw = onNavigate(AppRoutes.unlock)
  return (
    <Stack>
      <Box className={clsx(css.bordered, css.buttonContainer)}>
        <Typography variant="subtitle1" fontWeight={700}>
          Remove SAFE from locking
        </Typography>
        <Track {...NAVIGATION_EVENTS.OPEN_UNLOCKING}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onUnlockAndWithdraw}
            sx={{ borderWidth: '1px !important' }}
          >
            Unlock/Withdraw
          </Button>
        </Track>
      </Box>
    </Stack>
  )
}
