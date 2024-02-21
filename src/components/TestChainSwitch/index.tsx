import { FormControlLabel, Switch } from '@mui/material'
import type { ReactElement } from 'react'

import { Chains, IS_PRODUCTION } from '@/config/constants'
import { useChainId, defaultChainIdStore } from '@/hooks/useChainId'

export const TestChainSwitch = (): ReactElement | null => {
  const chainId = useChainId()

  const onToggle = () => {
    defaultChainIdStore.setStore((prev) => {
      return prev === Chains.SEPOLIA ? Chains.MAINNET : Chains.SEPOLIA
    })
  }

  if (IS_PRODUCTION) {
    return null
  }

  return (
    <FormControlLabel
      control={<Switch checked={chainId === Chains.SEPOLIA} onChange={onToggle} />}
      label="Use Sepolia"
    />
  )
}
