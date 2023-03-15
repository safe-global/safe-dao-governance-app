import { Grid, Typography, Button } from '@mui/material'
import type { ReactElement } from 'react'

import { useOnboard } from '@/hooks/useOnboard'
import { KeyholeIcon } from '@/components/KeyholeIcon'
import { OverviewLinks } from '@/components/OverviewLinks'
import { useChainId } from '@/hooks/useChainId'
import SafeLogo from '@/public/images/safe-logo.svg'
import { getConnectedWallet, switchWalletChain } from '@/utils/wallet'

export const ConnectWallet = (): ReactElement => {
  const onboard = useOnboard()
  const chainId = useChainId()

  const onClick = async () => {
    if (!onboard) {
      return
    }

    onboard.connectWallet().then(async (wallets) => {
      const wallet = getConnectedWallet(wallets)

      if (wallet && wallet.chainId !== chainId.toString()) {
        await switchWalletChain(onboard, wallet, chainId)
      }
    })
  }

  return (
    <Grid container flexDirection="column" alignItems="center" px={1} py={6}>
      <SafeLogo alt="Safe{DAO} logo" width={125} height={110} />

      <Typography variant="h1" m={5} mb={6} textAlign="center">
        Welcome to the next generation of digital ownership
      </Typography>

      <Grid item xs>
        <KeyholeIcon />
      </Grid>

      <Typography color="text.secondary" my={3} mx={18} textAlign="center">
        Connect your wallet to view your SAFE balance and delegate voting power
      </Typography>

      <Grid item xs={4} mb={4}>
        <Button variant="contained" color="primary" size="stretched" onClick={onClick}>
          Connect wallet
        </Button>
      </Grid>

      <Grid item xs={12}>
        <OverviewLinks />
      </Grid>
    </Grid>
  )
}
