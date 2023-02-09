import { FormControlLabel, Switch } from '@mui/material'
import type { ReactElement } from 'react'

import { Chains, IS_PRODUCTION, _DEFAULT_CHAIN_ID } from '@/config/constants'
import { useDefaultChainId, defaultChainIdStore } from '@/hooks/useDefaultChainId'

export const TestChainSwitch = (): ReactElement | null => {
  const defaultChainId = useDefaultChainId()

  const onToggle = () => {
    defaultChainIdStore.setStore((prev) => {
      return prev === Chains.GOERLI ? Chains.MAINNET : Chains.GOERLI
    })
  }

  if (IS_PRODUCTION) {
    return null
  }

  return (
    <FormControlLabel
      control={<Switch checked={defaultChainId === Chains.GOERLI} onChange={onToggle} />}
      label="Use Goerli"
    />
  )
}
