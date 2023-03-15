import { Box, Button } from '@mui/material'
import { hexValue } from 'ethers/lib/utils'
import type { ReactElement } from 'react'

import { useChain } from '@/hooks/useChain'
import { useOnboard } from '@/hooks/useOnboard'
import { useChainId } from '@/hooks/useChainId'
import { useWallet } from '@/hooks/useWallet'

import css from './styles.module.css'

export const ChainSwitcher = (): ReactElement | null => {
  const onboard = useOnboard()
  const wallet = useWallet()
  const defaultChain = useChain()
  const chainId = useChainId()

  if (!wallet || wallet.chainId === chainId.toString()) {
    return null
  }

  const handleChainSwitch = () => {
    onboard?.setChain({ chainId: hexValue(chainId) })
  }

  return (
    <Button onClick={handleChainSwitch} variant="outlined" size="small" color="primary" className={css.button}>
      Switch to&nbsp;
      <Box className={css.circle} bgcolor={defaultChain?.theme?.backgroundColor || ''} />
      {defaultChain?.chainName}
    </Button>
  )
}
