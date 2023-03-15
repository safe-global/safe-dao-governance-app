import { ProviderLabel } from '@web3-onboard/injected-wallets'
import { getSafeInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { getAddress, hexValue } from 'ethers/lib/utils'
import type { OnboardAPI, WalletState } from '@web3-onboard/core'

import { local } from '@/services/storage/local'
import { WALLET_KEYS } from '@/utils/onboard'
import type { ConnectedWallet } from '@/hooks/useWallet'

// Get the most recently connected wallet address
export const getConnectedWallet = (wallets: WalletState[]): ConnectedWallet | null => {
  if (!wallets) {
    return null
  }

  const primaryWallet = wallets[0]
  if (!primaryWallet) {
    return null
  }

  const account = primaryWallet?.accounts[0]
  if (!account) {
    return null
  }

  return {
    label: primaryWallet.label,
    address: getAddress(account.address),
    ens: account.ens?.name,
    chainId: Number(primaryWallet.chains[0].id).toString(10),
    provider: primaryWallet.provider,
  }
}

export const WalletNames = {
  METAMASK: ProviderLabel.MetaMask,
  WALLET_CONNECT: 'WalletConnect',
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

const isHardwareWallet = (wallet: ConnectedWallet): boolean => {
  return [WALLET_KEYS.LEDGER, WALLET_KEYS.TREZOR, WALLET_KEYS.KEYSTONE].includes(
    wallet.label.toUpperCase() as WALLET_KEYS,
  )
}

export const switchWalletChain = async (
  onboard: OnboardAPI,
  connectedWallet: ConnectedWallet,
  chainId: number,
): Promise<void> => {
  if (!isHardwareWallet(connectedWallet)) {
    await onboard.setChain({ wallet: connectedWallet.label, chainId: hexValue(chainId) })
    return
  }

  // It's not possible to change the chain of hardware wallets so we must first disconnect the wallet
  // then have the user manually select a new one
  await onboard.disconnectWallet({ label: connectedWallet.label })

  const newWallets = await onboard.connectWallet({ autoSelect: { label: connectedWallet.label, disableModals: true } })
  const newWallet = getConnectedWallet(newWallets)

  if (!newWallet || newWallet.chainId === chainId.toString()) {
    return
  }

  // If the user selected the wrong chain, try again
  await switchWalletChain(onboard, newWallet, chainId)
}
