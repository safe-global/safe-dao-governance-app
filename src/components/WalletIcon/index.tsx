import { Skeleton } from '@mui/material'

export const WalletIcon = ({ icon }: { icon: string }) => {
  return icon ? (
    <img
      width={30}
      height={30}
      alt="Wallet logo"
      src={icon.startsWith('data:') ? icon : `data:image/svg+xml;utf8,${encodeURIComponent(icon)}`}
    />
  ) : (
    <Skeleton variant="circular" width={30} height={30} />
  )
}
