import NextLink from 'next/link'
import { SvgIcon, Grid, Typography, Paper, Box, Link, Stack } from '@mui/material'
import { useRef } from 'react'
import type { ReactElement, SyntheticEvent } from 'react'

import Hat from '@/public/images/hat.svg'
import { AppRoutes } from '@/config/routes'
import { FORUM_URL, CHAIN_SNAPSHOT_URL } from '@/config/constants'
import { ExternalLink } from '@/components/ExternalLink'
import { useChainId } from '@/hooks/useChainId'

import css from './styles.module.css'

const SafeDaoCard = () => {
  const linkRef = useRef<HTMLAnchorElement>(null)

  const onClick = ({ target }: SyntheticEvent) => {
    if (linkRef.current && !linkRef.current.contains(target as Node)) {
      linkRef.current.click()
    }
  }

  return (
    <Paper className={css.card} onClick={onClick}>
      <div className={css.header}>
        <Typography className={css.title}>About</Typography>
        <SvgIcon component={Hat} inheritViewBox color="info" />
      </div>
      <Box>
        <Typography variant="h3" fontWeight={700} mt={5}>
          What is Safe DAO?
        </Typography>
        <Link href={AppRoutes.safedao} component={NextLink} ref={linkRef}>
          Learn more
        </Link>
      </Box>
    </Paper>
  )
}

const ExternalLinkCard = ({ header, title, href }: { header: string; title: string; href: string }): ReactElement => {
  const linkRef = useRef<HTMLAnchorElement>(null)

  const onClick = ({ target }: SyntheticEvent) => {
    if (linkRef.current && !linkRef.current.contains(target as Node)) {
      linkRef.current.click()
    }
  }

  return (
    <Paper className={css.card} onClick={onClick}>
      <Typography className={css.title}>{header}</Typography>
      <ExternalLink href={href} ref={linkRef}>
        {title}
      </ExternalLink>
    </Paper>
  )
}

export const OverviewLinks = ({ gridView }: { gridView?: boolean }): ReactElement => {
  const chainId = useChainId()

  const snapshotUrl = CHAIN_SNAPSHOT_URL[chainId]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={gridView ? 6 : 12}>
        <SafeDaoCard />
      </Grid>
      <Grid item xs container>
        <Grid item xs={12} pb={{ sm: 1, xs: 2 }}>
          <ExternalLinkCard href={FORUM_URL} header="Discuss" title="Safe{DAO} forum" />
        </Grid>
        <Grid item xs={12}>
          <ExternalLinkCard href={snapshotUrl} header="Vote" title="Snapshot" />
        </Grid>
      </Grid>
    </Grid>
  )
}
