import Head from 'next/head'
import { Box } from '@mui/material'
import { ReactElement, ReactNode } from 'react'

import manifestJson from '@/public/manifest.json'
import { BackgroundCircles } from '@/components/BackgroundCircles'
import { Header } from '@/components/Header'

import css from './styles.module.css'
import NavTabs from '../NavTabs'
import { AppRoutes } from '@/config/routes'
import { useRouter } from 'next/router'
import { NAVIGATION_EVENTS } from '@/analytics/navigation'

const RoutesWithNavigation = [AppRoutes.activity, AppRoutes.governance]

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

      <Box
        pt={{ sm: 7, xs: undefined }}
        pb={{ sm: 6, xs: undefined }}
        sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
        component="main"
      >
        <Box className={css.container}>
          {showNavigation && (
            <NavTabs
              tabs={[
                {
                  label: 'Activity App',
                  href: AppRoutes.activity,
                  event: NAVIGATION_EVENTS.OPEN_LOCKING,
                },
                {
                  label: 'Governance / Claiming',
                  href: AppRoutes.governance,
                  event: NAVIGATION_EVENTS.OPEN_CLAIM,
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
