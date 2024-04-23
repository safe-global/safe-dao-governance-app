import walletConnect from '@web3-onboard/walletconnect'
import type { WalletInit } from '@web3-onboard/common/dist/types.d'
import { hexValue } from '@ethersproject/bytes'
import Onboard from '@web3-onboard/core'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'

import manifestJson from '@/public/manifest.json'
import { getRpcServiceUrl } from '@/utils/web3'
import { WC_PROJECT_ID } from '@/config/constants'

export const enum WALLET_KEYS {
  WALLETCONNECT = 'WalletConnect',
}

const CGW_NAMES: { [key in WALLET_KEYS]: string } = {
  [WALLET_KEYS.WALLETCONNECT]: 'WalletConnect',
}

const walletConnectV2 = (chain: ChainInfo): WalletInit => {
  return walletConnect({
    version: 2,
    projectId: WC_PROJECT_ID,
    qrModalOptions: {
      themeVariables: {
        '--wcm-z-index': '1302',
      },
      themeMode: 'dark',
    },
    requiredChains: [parseInt(chain.chainId)],
  })
}

const WALLET_MODULES: { [key in WALLET_KEYS]: (chain: ChainInfo) => WalletInit } = {
  [WALLET_KEYS.WALLETCONNECT]: (chain) => walletConnectV2(chain),
}

const getAllWallets = (chain: ChainInfo): WalletInit[] => {
  return Object.values(WALLET_MODULES).map((module) => module(chain))
}

export const createOnboard = (chainConfigs: ChainInfo[], currentChain: ChainInfo) => {
  const chains = chainConfigs.map((cfg) => ({
    id: hexValue(parseInt(cfg.chainId)),
    label: cfg.chainName,
    rpcUrl: getRpcServiceUrl(cfg.rpcUri),
    token: cfg.nativeCurrency.symbol,
    color: cfg.theme.backgroundColor,
    publicRpcUrl: cfg.publicRpcUri.value,
    blockExplorerUrl: new URL(cfg.blockExplorerUriTemplate.address).origin,
  }))

  return Onboard({
    wallets: getAllWallets(currentChain),
    chains,
    accountCenter: {
      mobile: { enabled: false },
      desktop: { enabled: false },
    },
    appMetadata: {
      name: manifestJson.name,
      icon: location.origin + '/images/app-logo.svg',
      description: `Please select a wallet to connect to ${manifestJson.name}`,
    },
    connect: {
      removeWhereIsMyWalletWarning: true,
    },
  })
}

const isWalletSupported = (disabledWallets: string[], walletLabel: string): boolean => {
  const legacyWalletName = CGW_NAMES[walletLabel.toUpperCase() as WALLET_KEYS]
  return !disabledWallets.includes(legacyWalletName || walletLabel)
}

export const getSupportedWallets = (chain: ChainInfo): WalletInit[] => {
  return Object.entries(WALLET_MODULES)
    .filter(([key]) => isWalletSupported(chain.disabledWallets, key))
    .map(([, module]) => module(chain))
}
