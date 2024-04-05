import { Skeleton } from '@mui/material'
import walletConnectIcon from '@web3-onboard/walletconnect/dist/icon'

import { WALLET_KEYS } from '@/utils/onboard'

type Props = {
  [k in keyof typeof WALLET_KEYS]: string
}

const WALLET_ICONS: Props = {
  WALLETCONNECT: walletConnectIcon,
} as const

export const WalletIcon = ({ provider }: { provider: string }) => {
  const icon = WALLET_ICONS[provider.toUpperCase() as keyof typeof WALLET_ICONS]

  return icon ? (
    <img width={30} height={30} src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`} alt={`${provider} logo`} />
  ) : (
    <Skeleton variant="circular" width={30} height={30} />
  )
}
