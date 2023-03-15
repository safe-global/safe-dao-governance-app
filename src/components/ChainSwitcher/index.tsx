import { Box, Button } from '@mui/material'
import type { ReactElement } from 'react'

import { useChains } from '@/hooks/useChains'
import { useOnboard } from '@/hooks/useOnboard'
import { useChainId } from '@/hooks/useChainId'
import { useWallet } from '@/hooks/useWallet'
import { switchWalletChain } from '@/utils/wallet'

import css from './styles.module.css'

export const ChainSwitcher = (): ReactElement | null => {
  const onboard = useOnboard()
  const wallet = useWallet()
  const { data: chains } = useChains()
  const chainId = useChainId()
  const defaultChain = chains?.results.find((chain) => chain.chainId === chainId.toString())

  if (!wallet || wallet.chainId === chainId.toString()) {
    return null
  }

  const handleChainSwitch = async () => {
    if (onboard) {
      await switchWalletChain(onboard, wallet, chainId)
    }
  }

  return (
    <Button onClick={handleChainSwitch} variant="outlined" size="small" color="primary" className={css.button}>
      Switch to&nbsp;
      <Box className={css.circle} bgcolor={defaultChain?.theme?.backgroundColor || ''} />
      {defaultChain?.chainName}
    </Button>
  )
}
