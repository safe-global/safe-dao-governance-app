import React, { forwardRef, ReactElement } from 'react'
import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { Tab, Tabs, Typography, type TabProps } from '@mui/material'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import Track from '../Track'

export type NavItem = {
  label: string
  icon?: ReactElement
  href: string
  event: { action: string }
}

type Props = TabProps & NextLinkProps

// This is needed in order for the tabs to work properly with Next Link e.g. tabbing with the keyboard
// Based on https://github.com/mui/material-ui/blob/master/examples/nextjs-with-typescript/src/Link.tsx
const NextLinkComposed = forwardRef<HTMLAnchorElement, Props>(function NextComposedLink(props: Props, ref) {
  const { href, as, replace, scroll, shallow, prefetch, legacyBehavior = true, locale, ...other } = props

  return (
    <NextLink
      href={href}
      prefetch={prefetch}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}
      legacyBehavior={legacyBehavior}
    >
      {/* @ts-ignore */}
      <a ref={ref} {...other} />
    </NextLink>
  )
})

const NavTabs = ({ tabs }: { tabs: NavItem[] }) => {
  const router = useRouter()
  const activeTab = Math.max(0, tabs.map((tab) => tab.href).indexOf(router.pathname))

  const isSafeApp = useIsSafeApp()

  return (
    <Tabs value={activeTab} variant="scrollable" allowScrollButtonsMobile className={css.tabs}>
      {tabs.map((tab, idx) => (
        <Track {...tab.event} label={isSafeApp ? 'safe-app' : 'standalone'} key={tab.href}>
          <Tab
            component={NextLinkComposed}
            href={{ pathname: tab.href }}
            className={css.tab}
            label={
              <Typography
                variant="body2"
                fontWeight={700}
                color={activeTab === idx ? 'primary' : 'primary.light'}
                className={css.label}
              >
                {tab.label}
              </Typography>
            }
          />
        </Track>
      ))}
    </Tabs>
  )
}

export default NavTabs
