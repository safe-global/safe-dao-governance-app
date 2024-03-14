import Head from 'next/head'
import { Box } from '@mui/material'
import type { ReactElement, ReactNode } from 'react'

import manifestJson from '@/public/manifest.json'
import { BackgroundCircles } from '@/components/BackgroundCircles'
import { Header } from '@/components/Header'

import css from './styles.module.css'

export const PageLayout = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <>
      <Head>
        <title>{manifestJson.name}</title>
      </Head>

      <Header />

      <BackgroundCircles />

      <Box py={{ sm: 6, xs: undefined }} component="main">
        <Box className={css.container}>{children}</Box>
      </Box>
    </>
  )
}
