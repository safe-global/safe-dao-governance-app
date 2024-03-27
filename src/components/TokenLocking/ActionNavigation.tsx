import { NAVIGATION_EVENTS } from '@/analytics/navigation'
import { AppRoutes } from '@/config/routes'
import { useChainId } from '@/hooks/useChainId'
import { useWallet } from '@/hooks/useWallet'
import { getGovernanceAppSafeAppUrl } from '@/utils/safe-apps'
import { isSafe } from '@/utils/wallet'
import { Typography, Stack, Button, Box } from '@mui/material'
import { useRouter } from 'next/router'
import Track from '../Track'

import css from './styles.module.css'

export const ActionNavigation = () => {
  const router = useRouter()
  const wallet = useWallet()
  const chainId = useChainId()

  const onNavigate = (route: (typeof AppRoutes)[keyof typeof AppRoutes]) => async () => {
    // Safe is connected via WC
    if (wallet && (await isSafe(wallet))) {
      window.open(getGovernanceAppSafeAppUrl(chainId, wallet.address), '_blank')?.focus()
    } else {
      router.push(route)
    }
  }

  const onUnlockAndWithdraw = onNavigate(AppRoutes.unlock)
  return (
    <Stack>
      <Box className={`${css.bordered}`} display="flex" justifyContent="space-between" alignItems="center" padding={3}>
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
            <Box display="flex" alignItems="center">
              <Box>Unlock/Withdraw</Box>
            </Box>
          </Button>
        </Track>
      </Box>
    </Stack>
  )
}
