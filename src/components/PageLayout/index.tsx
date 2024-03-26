import Head from 'next/head'
import { Box } from '@mui/material'
import type { ReactElement, ReactNode } from 'react'

import manifestJson from '@/public/manifest.json'
import { BackgroundCircles } from '@/components/BackgroundCircles'
import { Header } from '@/components/Header'

import css from './styles.module.css'
import NavTabs from '../NavTabs'
import { AppRoutes } from '@/config/routes'
import { useRouter } from 'next/router'

export const RoutesWithNavigation = [AppRoutes.activity, AppRoutes.index]

export const PageLayout = ({ children }: { children: ReactNode }): ReactElement => {
  const router = useRouter()
  const showNavigation = RoutesWithNavigation.includes(router.route)

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
