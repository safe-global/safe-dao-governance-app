import { ProviderLabel } from '@web3-onboard/injected-wallets'
import { getSafeInfo } from '@safe-global/safe-gateway-typescript-sdk'

import { local } from '@/services/storage/local'
import { WALLET_CONNECT_V1_MODULE_NAME } from '@/utils/onboard'
import type { ConnectedWallet } from '@/hooks/useWallet'

export const WalletNames = {
  METAMASK: ProviderLabel.MetaMask,
  WALLET_CONNECT: WALLET_CONNECT_V1_MODULE_NAME,
}

export const isWalletUnlocked = async (walletName: string): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false
  }

  // Only MetaMask exposes a method to check if the wallet is unlocked
  if (walletName === WalletNames.METAMASK) {
    return window.ethereum?._metamask?.isUnlocked?.() || false
  }

  // Wallet connect creates a localStorage entry when connected and removes it when disconnected
  if (walletName === WalletNames.WALLET_CONNECT) {
    const WC_SESSION_KEY = 'walletconnect'
    return local.getItem(WC_SESSION_KEY) !== null
  }

  return false
}

export const isSafe = async (wallet: ConnectedWallet): Promise<boolean | null> => {
  try {
    return !!(await getSafeInfo(wallet.chainId, wallet.address))
  } catch {
    return false
  }
}
