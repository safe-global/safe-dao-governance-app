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

import '@/styles/globals.css'

// Temp
import React from 'react'

const InitApp = (): null => {
  setGatewayBaseUrl(GATEWAY_URL)

  useInitOnboard()
  useInitWeb3()
  useInitWallet()

  // Populate caches
  useChains()
  useDelegatesFile()
  useIsTokenPaused()
  useSafeSnapshot()

  return null
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const queryClient = getQueryClient()

class ErrorBoundary extends React.Component {
  //@ts-expect-error
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  //@ts-expect-error
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  //@ts-expect-error
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }
  render() {
    //@ts-expect-error
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    //@ts-expect-error
    return this.props.children
  }
}

const App = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppProps & {
  emotionCache?: EmotionCache
}): ReactElement => {
  const { pathname } = useRouter()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(() => {
    const colorSchemedTheme = initTheme(prefersDarkMode)
    // Extend the theme with the CssVarsProvider
    return extendMuiTheme(colorSchemedTheme)
  }, [prefersDarkMode])

  const page = <Component {...pageProps} />

  return (
    <CacheProvider value={emotionCache}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />

        <ErrorBoundary>
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
        </ErrorBoundary>
      </CssVarsProvider>
    </CacheProvider>
  )
}

export default App
