import { useRouter } from 'next/router'
import type { ReactElement } from 'react'

import { AppRoutes } from '@/config/routes'
import { useWeb3 } from '@/hooks/useWeb3'
import { SplashScreen } from '../SplashScreen'

const isProviderRoute = (pathname: string) => {
  return [
    AppRoutes.claim,
    AppRoutes.delegate,
    AppRoutes.activity,
    AppRoutes.index,
    AppRoutes.governance,
    AppRoutes.unlock,
  ].includes(pathname)
}

export const EnsureWalletConnection = ({ children }: { children: ReactElement }): ReactElement => {
  const router = useRouter()
  const web3 = useWeb3()

  const shouldRedirect = !web3 && isProviderRoute(router.pathname)

  return shouldRedirect ? <SplashScreen /> : children
}
