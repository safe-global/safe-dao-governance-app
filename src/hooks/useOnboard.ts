import { useEffect } from 'react'
import type { OnboardAPI } from '@web3-onboard/core'

import { ExternalStore } from '@/services/ExternalStore'
import { useChain } from '@/hooks/useChain'
import { createOnboard } from '@/utils/onboard'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'

const onboardStore = new ExternalStore<OnboardAPI>()

export const useOnboard = onboardStore.useStore

export const useInitOnboard = () => {
  const chain = useChain()

  const onboard = onboardStore.useStore()
  const isSafeApp = useIsSafeApp()

  // Create onboard instance when chains are loaded/running as dapp
  useEffect(() => {
    if (chain && !isSafeApp) {
      onboardStore.setStore(createOnboard([chain], chain))
    }
  }, [chain, isSafeApp])

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
