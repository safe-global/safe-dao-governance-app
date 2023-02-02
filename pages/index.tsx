import type { NextPage } from 'next'

import { useWallet } from '@/hooks/useWallet'
import { ConnectWallet } from '@/components/ConnectWallet'
import { Intro } from '@/components/Intro'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'

const IndexPage: NextPage = () => {
  const isSafeApp = useIsSafeApp()
  const wallet = useWallet()

  return !isSafeApp && !wallet ? <ConnectWallet /> : <Intro />
}

export default IndexPage
