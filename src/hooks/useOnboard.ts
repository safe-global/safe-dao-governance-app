import { useEffect } from 'react'
import type { OnboardAPI } from '@web3-onboard/core'

import { ExternalStore } from '@/services/ExternalStore'
import { useDefaultChainId } from './useDefaultChainId'
import { useChains } from '@/hooks/useChains'
import { createOnboard } from '@/utils/onboard'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'

const onboardStore = new ExternalStore<OnboardAPI>()

export const useOnboard = onboardStore.useStore

export const useInitOnboard = () => {
  const { data: chains } = useChains()
  const defaultChainId = useDefaultChainId()

  const chain = chains?.results.find(({ chainId }) => chainId === defaultChainId.toString())
  const onboard = onboardStore.useStore()
  const isSafeApp = useIsSafeApp()

  // Create onboard instance when chains are loaded/running as dapp
  useEffect(() => {
    if (chains?.results && !isSafeApp) {
      onboardStore.setStore(createOnboard(chains.results))
    }
  }, [chains?.results, isSafeApp])

  // Disable unsupported wallets on the current chain
  useEffect(() => {
    if (!chain || isSafeApp || !onboard) {
      return
    }

    const enableWallets = async () => {
      const { getSupportedWallets } = await import('@/utils/onboard')
      const supportedWallets = getSupportedWallets(chain)
      onboard.state.actions.setWalletModules(supportedWallets)
    }

    enableWallets()
  }, [isSafeApp, onboard, chain])
}
