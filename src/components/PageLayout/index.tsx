import Head from 'next/head'
import { Box } from '@mui/material'
import { ReactElement, ReactNode, useEffect } from 'react'

import manifestJson from '@/public/manifest.json'
import { BackgroundCircles } from '@/components/BackgroundCircles'
import { Header } from '@/components/Header'

import css from './styles.module.css'
import NavTabs from '../NavTabs'
import { AppRoutes, RoutesWithNavigation, RoutesRequiringWallet } from '@/config/routes'
import { useRouter } from 'next/router'
import { useWallet } from '@/hooks/useWallet'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'

export const PageLayout = ({ children }: { children: ReactNode }): ReactElement => {
  const router = useRouter()
  const showNavigation = RoutesWithNavigation.includes(router.route)

  const wallet = useWallet()
  const isSafeApp = useIsSafeApp()

  useEffect(() => {
    if (!wallet && !isSafeApp && RoutesRequiringWallet.includes(router.route)) {
      router.push(AppRoutes.connect)
    }
  }, [isSafeApp, router, wallet])

  return (
    <>
      <Head>
        <title>{manifestJson.name}</title>
      </Head>

      <Header />

      <BackgroundCircles />

      <Box py={{ sm: 6, xs: undefined }} component="main">
        <Box className={css.container}>
          {showNavigation && (
            <NavTabs
              tabs={[
                {
                  label: 'Activity App',
                  href: AppRoutes.activity,
                },
                {
                  label: 'Governance / Claiming',
                  href: AppRoutes.index,
                },
              ]}
            />
          )}
          {children}
        </Box>
      </Box>
    </>
  )
}
