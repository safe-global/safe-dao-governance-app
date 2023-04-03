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
import { isDashboard } from '@/utils/routes'
import { useSafeSnapshot } from '@/hooks/useSafeSnapshot'
import { usePendingDelegations } from '@/hooks/usePendingDelegations'

import '@/styles/globals.css'

const InitApp = (): null => {
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

  return null
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
