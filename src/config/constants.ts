// General
const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true'
export const INFURA_TOKEN = process.env.NEXT_PUBLIC_INFURA_TOKEN || ''

export const LS_NAMESPACE = 'SAFE__'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// Wallets
export const WC_BRIDGE = process.env.NEXT_PUBLIC_WC_BRIDGE || ''
export const TREZOR_APP_URL = 'app.safe.global'
export const TREZOR_EMAIL = 'support@safe.global'

// Deployments
// TODO: Update this to the correct deployment URLs
export const DEPLOYMENT_URL = IS_PRODUCTION ? 'https://governance.safe.global' : ''

export const GATEWAY_URL = IS_PRODUCTION ? 'https://safe-client.safe.global' : 'https://safe-client.staging.5afe.dev'

export const SAFE_URL = IS_PRODUCTION ? 'https://app.safe.global' : 'https://safe-web-core.staging.5afe.dev'

// Chains
export const Chains = {
  MAINNET: 1,
  GOERLI: 5,
}

// Strictly type configuration for each chain above
type ChainConfig<T> = Record<(typeof Chains)[keyof typeof Chains], T>

export const DEFAULT_CHAIN_ID = IS_PRODUCTION ? Chains.MAINNET : Chains.GOERLI

export const CHAIN_SHORT_NAME: ChainConfig<string> = {
  [Chains.MAINNET]: 'eth',
  [Chains.GOERLI]: 'gor',
}

// Token
export const CHAIN_SAFE_TOKEN_ADDRESS: ChainConfig<string> = {
  1: '0x5afe3855358e112b5647b952709e6165e1c1eeee',
  5: '0x61fD3b6d656F39395e32f46E2050953376c3f5Ff',
}

// Claiming
const CLAIMING_DATA_URL = IS_PRODUCTION
  ? 'https://safe-claiming-app-data.gnosis-safe.io'
  : 'https://safe-claiming-app-data.staging.5afe.dev'

export const GUARDIANS_URL = `${CLAIMING_DATA_URL}/guardians/guardians.json`
export const GUARDIANS_IMAGE_URL = `${CLAIMING_DATA_URL}/guardians/images`
export const VESTING_URL = `${CLAIMING_DATA_URL}/allocations`

// Delegation
export const CHAIN_DELEGATE_ID: ChainConfig<string> = {
  [Chains.MAINNET]: 'safe.eth',
  [Chains.GOERLI]: 'tutis.eth',
}

export const DELEGATE_REGISTRY_ADDRESS = '0x469788fe6e9e9681c6ebf3bf78e7fd26fc015446'

// Links
export const FORUM_URL = 'https://forum.safe.global'
export const GOVERNANCE_URL = 'https://forum.gnosis-safe.io/t/how-to-safedao-governance-process/846'
export const SNAPSHOT_URL = `https://snapshot.org/#/${CHAIN_DELEGATE_ID[DEFAULT_CHAIN_ID]}`
export const DISCORD_URL = 'https://chat.safe.global'
