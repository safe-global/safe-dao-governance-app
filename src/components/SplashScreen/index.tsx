import { Typography, Button, Chip, Stack, SvgIcon, Box, CircularProgress, Grid } from '@mui/material'
import { hexValue } from 'ethers/lib/utils'
import { ReactElement, useState } from 'react'

import { useOnboard } from '@/hooks/useOnboard'

import { useChainId } from '@/hooks/useChainId'
import { getConnectedWallet } from '@/hooks/useWallet'
import Barcode from '@/public/images/barcode.svg'

import css from './styles.module.css'
import SafePass from '@/public/images/safe-pass.svg'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import Asterix from '@/public/images/asterix.svg'
import { isSafe } from '@/utils/wallet'

const Step = ({ index, title, active }: { index: number; title: string; active: boolean }) => {
  return (
    <Stack direction="row" gap={2}>
      <Chip
        size="small"
        sx={{ width: '24px', height: '24px' }}
        label={index + 1}
        color={active ? 'primary' : undefined}
      />
      <Typography>{title}</Typography>
    </Stack>
  )
}

/**
 * This page handles wallet connection and initial data loading.
 */
export const SplashScreen = (): ReactElement => {
  const onboard = useOnboard()
  const chainId = useChainId()
  const isSafeApp = useIsSafeApp()

  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string>()

  const onConnect = async () => {
    if (!onboard) {
      return
    }
    setError(undefined)
    setIsConnecting(true)
    try {
      const wallets = await onboard.connectWallet()
      const wallet = getConnectedWallet(wallets)

      // Here we check non-hardware wallets. Hardware wallets will always be on the correct
      // chain as onboard is only ever initialised with the current chain config
      const isWrongChain = wallet && wallet.chainId !== chainId
      if (isWrongChain) {
        await onboard.setChain({ wallet: wallet.label, chainId: hexValue(parseInt(chainId)) })
      }

      // When using the standalone app, only allow Safe accounts to be connected
      if (wallet && !isSafeApp && !(await isSafe(wallet))) {
        await onboard.disconnectWallet({ label: wallet.label })
        setError('Connected wallet must be a Safe')
        alert('Connected wallet is not a Safe Account. Please connect a Safe Account.')
        return
      }
    } catch (error) {
      setError('Wallet connection failed.')
      return
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Box display="flex" width="100%">
      <Grid container direction="row" className={css.milesReceipt}>
        <Grid item xs={12} md={8}>
          <Stack className={css.leftReceipt} justifyContent="space-between">
            <SvgIcon
              component={Asterix}
              inheritViewBox
              sx={{ color: 'transparent', position: 'absolute', top: 0, right: 0, height: '208px', width: '208px' }}
            />
            <SvgIcon component={SafePass} inheritViewBox sx={{ width: '175px', height: 'auto' }} />
            <Stack spacing={3} p={3}>
              <Typography variant="h2" fontSize="44px" lineHeight="120%" fontWeight="bold">
                Interact with Safe and get rewards
              </Typography>
              <Typography>Get your pass now! Lock your tokens and be active on Safe to get rewarded.</Typography>
              <Box>
                <Button variant="contained" color="primary" onClick={onConnect} disabled={isConnecting}>
                  {isConnecting ? (
                    <Box display="flex" alignItems="center" flexDirection="row" gap={1}>
                      <Typography>Connecting</Typography>
                      <CircularProgress size={12} />
                    </Box>
                  ) : (
                    'Connect wallet'
                  )}
                </Button>

                {error && (
                  <Typography mt={1} color="error.main">
                    {error}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack className={css.rightReceipt} gap={3} justifyContent="center">
            <Typography variant="caption" textTransform="uppercase" letterSpacing="1px" mt={12}>
              How it works
            </Typography>
            <Stack gap={3}>
              <Step index={0} title="Lock SAFE to boost your points!" active />
              <Step index={1} title="Earn points for activity" active />
              <Step index={2} title="Get rewards for earned points" active={false} />
            </Stack>
            <Barcode className={css.barcode} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
