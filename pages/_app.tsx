import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import { useEffect, useMemo } from 'react'
import { CacheProvider } from '@emotion/react'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme,
} from '@mui/material/styles'
import { useMediaQuery, CssBaseline } from '@mui/material'
import { setBaseUrl as setGatewayBaseUrl } from '@safe-global/safe-gateway-typescript-sdk'
import { useRouter } from 'next/router'
import type { EmotionCache } from '@emotion/react'
import type { AppProps } from 'next/app'
import type { ReactElement } from 'react'

import { useInitOnboard } from '@/hooks/useOnboard'
import { useInitWeb3 } from '@/hooks/useWeb3'
import initTheme from '@/styles/theme'
import { useDelegatesFile } from '@/hooks/useDelegatesFile'
import { useChain } from '@/hooks/useChain'
import { PageLayout } from '@/components/PageLayout'
import { useIsTokenPaused } from '@/hooks/useIsTokenPaused'
import { useInitWallet } from '@/hooks/useWallet'
import { EnsureWalletConnection } from '@/components/EnsureWalletConnection'
import { createEmotionCache } from '@/styles/emotion'
import { GATEWAY_URL } from '@/config/constants'
import { AppRoutes } from '@/config/routes'
import { useSafeSnapshot } from '@/hooks/useSafeSnapshot'
import { useContractDelegateInvalidator } from '@/hooks/useContractDelegate'
import { useSafeTokenTransferInvalidator } from '@/hooks/useSafeTokenAllocation'
import { usePendingDelegations } from '@/hooks/usePendingDelegations'

import '@/styles/globals.css'

const isDashboard = (pathname: string): boolean => {
  return pathname === AppRoutes.widgets
}

/**
 * TODO: Migrate invalidators to use custom timeouts instead of
 * ethers' `on` function as they do not allow custom timeouts
 * and otherwise increase RPC calls substantially.
 *
 * {@link} useContractDelegateInvalidator
 * {@link} useSafeTokenTransferInvalidator
 *
 * @see https://docs.ethers.org/v5/concepts/events/
 */
const Invalidators = (): null => {
  useContractDelegateInvalidator()
  useSafeTokenTransferInvalidator()

  return null
}

const InitApp = (): ReactElement | null => {
  const { pathname } = useRouter()

  setGatewayBaseUrl(GATEWAY_URL)

  useInitOnboard()
  useInitWeb3()
  useInitWallet()

  usePendingDelegations()

  // Populate caches
  useChain()
  useDelegatesFile()
  useIsTokenPaused()
  useSafeSnapshot()

  // Only run invalidators when app is open to decrease RPC calls
  if (isDashboard(pathname)) {
    return null
  }

  return <Invalidators />
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const App = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppProps & {
  emotionCache?: EmotionCache
}): ReactElement => {
  const { pathname, query } = useRouter()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  // Workaround for dark mode widgets
  const isDarkMode = query.theme ? query.theme === 'dark' : prefersDarkMode

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    }
  }, [isDarkMode])

  const theme = useMemo(() => {
    // Extend the theme with the CssVarsProvider
    return extendMuiTheme(initTheme(isDarkMode))
    // Widgets don't navigate, so we need not worry about the query changing
  }, [isDarkMode])

  const page = <Component {...pageProps} />

  return (
    <CacheProvider value={emotionCache}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />

        <SafeProvider>
          <InitApp />

          {isDashboard(pathname) ? (
            page
          ) : (
            <PageLayout>
              <EnsureWalletConnection>{page}</EnsureWalletConnection>
            </PageLayout>
          )}
        </SafeProvider>
      </CssVarsProvider>
    </CacheProvider>
  )
}

export default App
