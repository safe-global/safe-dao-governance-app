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

const RoutesWithNavigation = [AppRoutes.index, AppRoutes.points, AppRoutes.activity, AppRoutes.governance]

export const PageLayout = ({
  children,
  hideNavigation,
}: {
  children: ReactNode
  hideNavigation?: boolean
}): ReactElement => {
  const router = useRouter()
  const showNavigation = RoutesWithNavigation.includes(router.route) && !hideNavigation

  return (
    <>
      <Head>
        <title>{manifestJson.name}</title>
      </Head>

      <Header />

      <BackgroundCircles />

      <Box pt={7} pb={6} sx={{ minHeight: '100vh' }} component="main">
        <Box className={css.container}>
          {showNavigation && (
            <Box className={css.navigation}>
              <NavTabs
                tabs={[
                  {
                    label: 'Activities & Points',
                    href: AppRoutes.points,
                    event: NAVIGATION_EVENTS.OPEN_POINTS,
                  },
                  {
                    label: 'Locking',
                    href: AppRoutes.activity,
                    event: NAVIGATION_EVENTS.OPEN_LOCKING,
                  },
                  {
                    label: 'Governance & Claiming',
                    href: AppRoutes.governance,
                    event: NAVIGATION_EVENTS.OPEN_CLAIM,
                  },
                ]}
              />
            </Box>
          )}
          <Box className={css.pageContent}>{children}</Box>
        </Box>
      </Box>
    </>
  )
}
