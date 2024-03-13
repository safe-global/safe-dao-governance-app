import Head from 'next/head'
import { Box, Paper } from '@mui/material'
import type { ReactElement, ReactNode } from 'react'

import manifestJson from '@/public/manifest.json'
import { BottomCircle, TopCircle } from '@/components/BackgroundCircles'
import { Header } from '@/components/Header'

import css from './styles.module.css'
import NavTabs from '../NavTabs'
import { AppRoutes, RoutesWithNavigation } from '@/config/routes'
import { useRouter } from 'next/router'

export const PageLayout = ({ children }: { children: ReactNode }): ReactElement => {
  const router = useRouter()
  const showNavigation = RoutesWithNavigation.includes(router.route)

  return (
    <>
      <Head>
        <title>{manifestJson.name}</title>
      </Head>

      <Header />

      <Box py={{ sm: 6, xs: undefined }} component="main">
        <Box className={css.container}>
          <BottomCircle />
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

          <TopCircle />
        </Box>
      </Box>
    </>
  )
}
