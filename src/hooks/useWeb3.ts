import { useEffect } from 'react'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { useWallet } from '@/hooks/useWallet'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import { ExternalStore } from '@/services/ExternalStore'
import { createSafeProvider, createWeb3Provider } from '@/utils/web3'
import { isSafe } from '@/utils/wallet'

const web3Store = new ExternalStore<JsonRpcProvider>()

export const useWeb3 = web3Store.useStore

export const useInitWeb3 = (): void => {
  const isSafeApp = useIsSafeApp()
  const sdk = useSafeAppsSDK()
  const wallet = useWallet()

  useEffect(() => {
    if (isSafeApp && sdk.connected) {
      web3Store.setStore(createSafeProvider(sdk))
      return
    }

    if (wallet?.provider) {
      web3Store.setStore(createWeb3Provider(wallet.provider))
      return
    }

    // A Safe app can not disconnect
    if (!isSafeApp) {
      web3Store.setStore(undefined)
    }
  }, [isSafeApp, sdk, wallet?.provider])
}
