import { Skeleton } from '@mui/material'
import metamaskIcon from '@web3-onboard/injected-wallets/dist/icons/metamask'
import coinbaseIcon from '@web3-onboard/coinbase/dist/icon'
import keystoneIcon from '@web3-onboard/keystone/dist/icon'
import walletConnectIcon from '@web3-onboard/walletconnect/dist/icon'
import trezorIcon from '@web3-onboard/trezor/dist/icon'
import ledgerIcon from '@web3-onboard/ledger/dist/icon'
import tahoIcon from '@web3-onboard/taho/dist/icon'

import { INJECTED_WALLET_KEYS, WALLET_KEYS } from '@/utils/onboard'

type Props = {
  [k in keyof (typeof WALLET_KEYS & typeof INJECTED_WALLET_KEYS)]: string
}

const WALLET_ICONS: Props = {
  [INJECTED_WALLET_KEYS.METAMASK]: metamaskIcon,
  [WALLET_KEYS.COINBASE]: coinbaseIcon,
  [WALLET_KEYS.INJECTED]: metamaskIcon,
  [WALLET_KEYS.KEYSTONE]: keystoneIcon,
  [WALLET_KEYS.WALLETCONNECT]: walletConnectIcon,
  [WALLET_KEYS.WALLETCONNECT_V2]: walletConnectIcon,
  [WALLET_KEYS.TREZOR]: trezorIcon,
  [WALLET_KEYS.LEDGER]: ledgerIcon,
  [WALLET_KEYS.TAHO]: tahoIcon,
}

export const WalletIcon = ({ provider }: { provider: string }) => {
  const icon = WALLET_ICONS[provider.toUpperCase() as keyof typeof WALLET_ICONS]

  return icon ? (
    <img width={30} height={30} src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`} alt={`${provider} logo`} />
  ) : (
    <Skeleton variant="circular" width={30} height={30} />
  )
}
