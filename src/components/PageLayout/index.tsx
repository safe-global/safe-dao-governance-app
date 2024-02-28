import Head from 'next/head'
import { Box, Paper } from '@mui/material'
import type { ReactElement, ReactNode } from 'react'

import manifestJson from '@/public/manifest.json'
import { BottomCircle, TopCircle } from '@/components/BackgroundCircles'
import { Header } from '@/components/Header'
import { FloatingTiles } from '@/components/FloatingTiles'

import css from './styles.module.css'

export const PageLayout = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <>
      <Head>
        <title>{manifestJson.name}</title>
      </Head>

      <Header />

      <div className={css.tiles}>
        <FloatingTiles tiles={50} />
      </div>

      <Box py={{ sm: 6, xs: undefined }} component="main">
        <Box className={css.container}>
          <BottomCircle />

          {children}

          <TopCircle />
        </Box>
      </Box>
    </>
  )
}
