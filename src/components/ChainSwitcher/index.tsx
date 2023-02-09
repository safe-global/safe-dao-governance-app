import { Box, Button } from '@mui/material'
import { hexValue } from 'ethers/lib/utils'
import type { ReactElement } from 'react'

import { useChains } from '@/hooks/useChains'
import { useOnboard } from '@/hooks/useOnboard'
import { useDefaultChainId } from '@/hooks/useDefaultChainId'
import { useWallet } from '@/hooks/useWallet'

import css from './styles.module.css'

export const ChainSwitcher = (): ReactElement | null => {
  const onboard = useOnboard()
  const wallet = useWallet()
  const { data: chains } = useChains()
  const defaultChainId = useDefaultChainId()
  const defaultChain = chains?.results.find((chain) => chain.chainId === defaultChainId.toString())

  if (!wallet || wallet.chainId === defaultChainId.toString()) {
    return null
  }

  const handleChainSwitch = () => {
    const chainId = hexValue(defaultChainId)
    onboard?.setChain({ chainId })
  }

  return (
    <Button onClick={handleChainSwitch} variant="outlined" size="small" color="primary">
      Switch to&nbsp;
      <Box className={css.circle} bgcolor={defaultChain?.theme?.backgroundColor || ''} />
      &nbsp;{defaultChain?.chainName}
    </Button>
  )
}
