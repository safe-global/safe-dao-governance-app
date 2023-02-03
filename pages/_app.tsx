import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import { useMemo } from 'react'
import { CacheProvider } from '@emotion/react'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme,
} from '@mui/material/styles'
import { useMediaQuery, CssBaseline } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { setBaseUrl as setGatewayBaseUrl } from '@safe-global/safe-gateway-typescript-sdk'
import { useRouter } from 'next/router'
import type { EmotionCache } from '@emotion/react'
import type { AppProps } from 'next/app'
import type { ReactElement } from 'react'

import { useInitOnboard } from '@/hooks/useOnboard'
import { useInitWeb3 } from '@/hooks/useWeb3'
import initTheme from '@/styles/theme'
import { useDelegatesFile } from '@/hooks/useDelegatesFile'
import { useChains } from '@/hooks/useChains'
import { PageLayout } from '@/components/PageLayout'
import { getQueryClient } from '@/services/QueryClient'
import { useIsTokenPaused } from '@/hooks/useIsTokenPaused'
import { useInitWallet } from '@/hooks/useWallet'
import { EnsureWalletConnection } from '@/components/EnsureWalletConnection'
import { createEmotionCache } from '@/styles/emotion'
import { GATEWAY_URL } from '@/config/constants'
import { AppRoutes } from '@/config/routes'
import { useSafeSnapshot } from '@/hooks/useSafeSnapshot'
import { useContractDelegateInvalidator } from '@/hooks/useContractDelegate'
import { usePendingDelegations } from '@/hooks/usePendingDelegations'

import '@/styles/globals.css'

const InitApp = (): null => {
  setGatewayBaseUrl(GATEWAY_URL)

  useInitOnboard()
  useInitWeb3()
  useInitWallet()

  usePendingDelegations()

  // Populate caches
  useChains()
  useDelegatesFile()
  useIsTokenPaused()
  useSafeSnapshot()

  // Invalidate caches
  useContractDelegateInvalidator()

  return null
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const queryClient = getQueryClient()

const App = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppProps & {
  emotionCache?: EmotionCache
}): ReactElement => {
  const { pathname, query } = useRouter()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(() => {
    // Workaround for dark mode widgets
    const isDarkMode = query.theme ? query.theme === 'dark' : prefersDarkMode
    const colorSchemedTheme = initTheme(isDarkMode)
    // Extend the theme with the CssVarsProvider
    return extendMuiTheme(colorSchemedTheme)
    // Widgets don't navigate, so we need not worry about the query changing
  }, [prefersDarkMode, query.theme])

  const page = <Component {...pageProps} />

  return (
    <CacheProvider value={emotionCache}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />

        <SafeProvider>
          <QueryClientProvider client={queryClient}>
            <InitApp />

            {pathname === AppRoutes.widgets ? (
              page
            ) : (
              <PageLayout>
                <EnsureWalletConnection>{page}</EnsureWalletConnection>
              </PageLayout>
            )}
          </QueryClientProvider>
        </SafeProvider>
      </CssVarsProvider>
    </CacheProvider>
  )
}

export default App
