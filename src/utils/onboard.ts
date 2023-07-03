import coinbaseModule from '@web3-onboard/coinbase'
import injectedWalletModule, { ProviderLabel } from '@web3-onboard/injected-wallets'
import keystoneModule from '@web3-onboard/keystone'
import ledgerModule from '@web3-onboard/ledger/dist/index'
import trezorModule from '@web3-onboard/trezor'
import walletConnect from '@web3-onboard/walletconnect'
import tahoModule from '@web3-onboard/taho'
import type { RecommendedInjectedWallets, WalletInit, WalletModule } from '@web3-onboard/common/dist/types.d'
import { hexValue } from '@ethersproject/bytes'
import Onboard from '@web3-onboard/core'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'

import manifestJson from '@/public/manifest.json'
import { getRpcServiceUrl } from '@/utils/web3'
import { TREZOR_APP_URL, TREZOR_EMAIL, WC_BRIDGE, WC_PROJECT_ID } from '@/config/constants'

export const enum WALLET_KEYS {
  COINBASE = 'COINBASE',
  INJECTED = 'INJECTED',
  KEYSTONE = 'KEYSTONE',
  LEDGER = 'LEDGER',
  TAHO = 'TAHO',
  TREZOR = 'TREZOR',
  WALLETCONNECT = 'WALLETCONNECT',
  WALLETCONNECT_V2 = 'WALLETCONNECT_V2',
}

export const enum INJECTED_WALLET_KEYS {
  METAMASK = 'METAMASK',
}

const CGW_NAMES: { [key in WALLET_KEYS]: string } = {
  [WALLET_KEYS.COINBASE]: 'coinbase',
  [WALLET_KEYS.INJECTED]: 'detectedwallet',
  [WALLET_KEYS.KEYSTONE]: 'keystone',
  [WALLET_KEYS.LEDGER]: 'ledger',
  [WALLET_KEYS.TAHO]: 'tally',
  [WALLET_KEYS.TREZOR]: 'trezor',
  [WALLET_KEYS.WALLETCONNECT]: 'walletConnect',
  [WALLET_KEYS.WALLETCONNECT_V2]: 'walletConnect_v2',
}

const prefersDarkMode = (): boolean => {
  return window?.matchMedia('(prefers-color-scheme: dark)')?.matches
}

// We need to modify the module name as onboard dedupes modules with the same label and the WC v1 and v2 modules have the same
// @see https://github.com/blocknative/web3-onboard/blob/d399e0b76daf7b363d6a74b100b2c96ccb14536c/packages/core/src/store/actions.ts#L419
// TODO: When removing this, also remove the associated CSS in `onboard.css`
export const WALLET_CONNECT_V1_MODULE_NAME = 'WalletConnect v1'
const walletConnectV1 = (): WalletInit => {
  return (helpers) => {
    const walletConnectModule = walletConnect({ version: 1, bridge: WC_BRIDGE })(helpers) as WalletModule

    walletConnectModule.label = WALLET_CONNECT_V1_MODULE_NAME

    return walletConnectModule
  }
}

const walletConnectV2 = (chain: ChainInfo): WalletInit => {
  return walletConnect({
    version: 2,
    projectId: WC_PROJECT_ID,
    qrModalOptions: {
      themeVariables: {
        '--wcm-z-index': '1302',
      },
      themeMode: prefersDarkMode() ? 'dark' : 'light',
    },
    requiredChains: [parseInt(chain.chainId)],
  })
}

const WALLET_MODULES: { [key in WALLET_KEYS]: (chain: ChainInfo) => WalletInit } = {
  [WALLET_KEYS.COINBASE]: () => coinbaseModule({ darkMode: prefersDarkMode() }),
  [WALLET_KEYS.INJECTED]: () => injectedWalletModule(),
  [WALLET_KEYS.KEYSTONE]: () => keystoneModule(),
  [WALLET_KEYS.LEDGER]: () => ledgerModule(),
  [WALLET_KEYS.TAHO]: () => tahoModule(),
  [WALLET_KEYS.TREZOR]: () => trezorModule({ appUrl: TREZOR_APP_URL, email: TREZOR_EMAIL }),
  [WALLET_KEYS.WALLETCONNECT]: () => walletConnectV1(),
  [WALLET_KEYS.WALLETCONNECT_V2]: (chain) => walletConnectV2(chain),
}

const getAllWallets = (chain: ChainInfo): WalletInit[] => {
  return Object.values(WALLET_MODULES).map((module) => module(chain))
}

const getRecommendedInjectedWallets = (): RecommendedInjectedWallets[] => {
  return [{ name: ProviderLabel.MetaMask, url: 'https://metamask.io' }]
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
      icon: '/images/app-logo.svg',
      description: `Please select a wallet to connect to ${manifestJson.name}`,
      recommendedInjectedWallets: getRecommendedInjectedWallets(),
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
