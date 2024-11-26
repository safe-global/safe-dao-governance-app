import { BigNumber } from 'ethers'

// General
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true'
export const INFURA_TOKEN = process.env.NEXT_PUBLIC_INFURA_TOKEN || ''
export const FINGERPRINT_KEY = process.env.NEXT_PUBLIC_FINGERPRINT_KEY || ''

export const LS_NAMESPACE = 'SAFE__'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const POLLING_INTERVAL = 15_000

// Wallets
export const WC_BRIDGE = process.env.NEXT_PUBLIC_WC_BRIDGE || 'https://bridge.walletconnect.org'
export const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'safe'
export const TREZOR_APP_URL = 'app.safe.global'
export const TREZOR_EMAIL = 'support@safe.global'

// Deployments
export const DEPLOYMENT_URL = IS_PRODUCTION
  ? 'https://community.safe.global'
  : 'https://safe-dao-governance.dev.5afe.dev'

export const GATEWAY_URL = IS_PRODUCTION ? 'https://safe-client.safe.global' : 'https://safe-client.staging.5afe.dev'

export const SAFE_URL = IS_PRODUCTION ? 'https://app.safe.global' : 'https://safe-wallet-web.staging.5afe.dev'

// Chains
export const Chains = {
  MAINNET: '1',
  SEPOLIA: '11155111',
}

// Strictly type configuration for each chain above
type ChainConfig<T> = Record<(typeof Chains)[keyof typeof Chains], T>

export const _DEFAULT_CHAIN_ID = IS_PRODUCTION ? Chains.MAINNET : Chains.SEPOLIA

export const CHAIN_SHORT_NAME: ChainConfig<string> = {
  [Chains.MAINNET]: 'eth',
  [Chains.SEPOLIA]: 'sep',
}

export const CHAIN_START_TIMESTAMPS: ChainConfig<number> = {
  [Chains.MAINNET]: Date.parse('Tue Apr 23 2024 12:00:00 GMT+0000'),
  [Chains.SEPOLIA]: Date.parse('Tue Mar 01 2024 12:00:00 GMT+0000'),
}

// Token
export const CHAIN_SAFE_TOKEN_ADDRESS: ChainConfig<string> = {
  [Chains.MAINNET]: '0x5afe3855358e112b5647b952709e6165e1c1eeee',
  [Chains.SEPOLIA]: '0xd16d9C09d13E9Cf77615771eADC5d51a1Ae92a26',
}

export const CHAIN_SAFE_LOCKING_ADDRESS: ChainConfig<string> = {
  [Chains.MAINNET]: '0x0a7CB434f96f65972D46A5c1A64a9654dC9959b2',
  [Chains.SEPOLIA]: '0xb161ccb96b9b817F9bDf0048F212725128779DE9',
}

// Claiming
const CLAIMING_DATA_URL = IS_PRODUCTION
  ? 'https://safe-claiming-app-data.safe.global'
  : 'https://safe-claiming-app-data.staging.5afe.dev'

export const CGW_BASE_URL = {
  [Chains.MAINNET]: 'https://safe-client.safe.global',
  [Chains.SEPOLIA]: 'https://safe-client.staging.5afe.dev',
}

export const GUARDIANS_URL = `${CLAIMING_DATA_URL}/guardians/guardians.json`
export const GUARDIANS_IMAGE_URL = `${CLAIMING_DATA_URL}/guardians/images`
export const VESTING_URL = `${CLAIMING_DATA_URL}/allocations`

export const SEP5_EXPIRATION_DATE = '27.10.2023'
export const SEP5_EXPIRATION = `${SEP5_EXPIRATION_DATE} 10:00 UTC`

export const SAP_LOCK_DATE = '01.01.2026' // TBD

export const AIRDROP_TAGS = {
  USER: 'user',
  SEP5: 'user_v2',
  ECOSYSTEM: 'ecosystem',
  INVESTOR: 'investor',
  SAP_BOOSTED: 'sap_boosted',
  SAP_UNBOOSTED: 'sap_unboosted',
} as const

// Delegation
export const CHAIN_DELEGATE_ID: ChainConfig<string> = {
  [Chains.MAINNET]: 'safe.eth',
  [Chains.SEPOLIA]: 'panzerschrank.eth',
}

export const DELEGATE_REGISTRY_ADDRESS = '0x469788fe6e9e9681c6ebf3bf78e7fd26fc015446'

// Links
export const FORUM_URL = 'https://forum.safe.global'
export const GOVERNANCE_URL = 'https://forum.gnosis-safe.io/t/how-to-safedao-governance-process/846'

export const CHAIN_SNAPSHOT_URL: ChainConfig<string> = {
  [Chains.MAINNET]: `https://snapshot.org/#/${CHAIN_DELEGATE_ID[Chains.MAINNET]}`,
  [Chains.SEPOLIA]: `https://snapshot.org/#/${CHAIN_DELEGATE_ID[Chains.SEPOLIA]}`,
}

export const CHAIN_EXPLORER_URL: ChainConfig<string> = {
  [Chains.MAINNET]: 'https://etherscan.io/address/',
  [Chains.SEPOLIA]: 'https://sepolia.etherscan.io/address/',
}

export const SEP5_PROPOSAL_URL =
  'https://snapshot.org/#/safe.eth/proposal/0xb4765551b4814b592d02ce67de05527ac1d2b88a8c814c4346ecc0c947c9b941'

export const SAFE_PASS_LANDING_PAGE = 'https://safe.global/pass'
export const SAFE_PASS_HELP_ARTICLE_URL = 'https://help.safe.global/en/articles/157043-what-is-safe-pass'
export const SAFE_TERMS_AND_CONDITIONS_URL = 'https://help.safe.global/en/articles/157469-terms-and-conditions'

export const DISCORD_URL = 'https://chat.safe.global'

export const UNLIMITED_APPROVAL_AMOUNT = BigNumber.from(2).pow(256).sub(1)

export const SEASON2_START = 160
export const SEASON1_START = 33

export const GLOBAL_CAMPAIGN_IDS: ChainConfig<string> = {
  [Chains.SEPOLIA]: 'fa9f462b-8e8c-4122-aa41-2464e919b721',
  [Chains.MAINNET]: '9ed78b8b-178d-4e25-9ef2-1517865991ee',
}

export const MORPHO_CAMPAIGN_IDS: ChainConfig<string> = {
  [Chains.SEPOLIA]: '0317a716-2818-4cc2-8571-71208996650e',
  [Chains.MAINNET]: 'a19a5503-b65a-42a0-bc6a-8e68144d2afa',
}

export const AGGREGATE_CAMPAIGN_IDS: ChainConfig<string> = {
  [Chains.SEPOLIA]: '2a99f13c-0aa3-4484-9479-10962005d292',
  [Chains.MAINNET]: '2a99f13c-0aa3-4484-9479-10962005d292', // TBD
}
