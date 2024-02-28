import { AppRoutes } from '@/config/routes'
import { useChainId } from '@/hooks/useChainId'
import { useWallet } from '@/hooks/useWallet'
import { getGovernanceAppSafeAppUrl } from '@/utils/safe-apps'
import { isSafe } from '@/utils/wallet'
import { ChevronRight } from '@mui/icons-material'
import { Grid, Typography, Stack, Button, Box } from '@mui/material'
import { useRouter } from 'next/router'

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
    <Grid container direction="row" spacing={3}>
      <Grid item xs={8}>
        <Box className={`${css.bordered}`} padding={3}>
          <Typography variant="subtitle1" fontWeight={700}>
            Want tot get a higher boost?
          </Typography>
          <Typography variant="body2">Buy and lock 5000 tokens to get +1.4x</Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Stack>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onUnlockAndWithdraw}
            sx={{ borderWidth: '1px !important' }}
          >
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
              <Box>Unlock & Withdraw</Box>
              <ChevronRight fontSize="medium" />
            </Box>
          </Button>
        </Stack>
      </Grid>
    </Grid>
  )
}
