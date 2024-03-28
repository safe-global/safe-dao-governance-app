import { Typography, Button, Chip, Stack, SvgIcon, Box, CircularProgress } from '@mui/material'
import { hexValue } from 'ethers/lib/utils'
import { ReactElement, useState } from 'react'

import { useOnboard } from '@/hooks/useOnboard'

import { useChainId } from '@/hooks/useChainId'
import { getConnectedWallet, useWallet } from '@/hooks/useWallet'
import { useRouter } from 'next/router'
import { AppRoutes } from '@/config/routes'
import Barcode from '@/public/images/barcode.svg'

import css from './styles.module.css'
import SafeMiles from '@/public/images/safe-miles.svg'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import { CHAIN_START_TIMESTAMPS } from '@/config/constants'
import Asterix from '@/public/images/asterix.svg'
import { useLockHistory } from '@/hooks/useLockHistory'

const JUNE_10_TIMESTAMP = 1718013600000
const SEPTEMBER_10_TIMESTAMP = 1725962400000

const Step = ({ index, title, active }: { index: number; title: string; active: boolean }) => {
  return (
    <Stack direction="row" gap={2}>
      <Chip
        size="small"
        sx={{ width: '24px', height: '24px' }}
        label={index + 1}
        color={active ? 'primary' : undefined}
      />
      <Typography>{title}</Typography>
    </Stack>
  )
}

/**
 * This page handles wallet connection and initial data loading.
 */
export const SplashScreen = (): ReactElement => {
  const onboard = useOnboard()
  const chainId = useChainId()
  const router = useRouter()

  const [isConnecting, setIsConnecting] = useState(false)

  const isSafeApp = useIsSafeApp()
  const wallet = useWallet()

  const today = Date.now()
  const stepsActive = [
    today >= CHAIN_START_TIMESTAMPS[chainId],
    today >= JUNE_10_TIMESTAMP,
    today >= SEPTEMBER_10_TIMESTAMP,
  ]

  const isDisconnected = !isSafeApp && !wallet

  const onConnect = async () => {
    if (!onboard) {
      return
    }
    setIsConnecting(true)
    try {
      const wallets = await onboard.connectWallet()
      const wallet = getConnectedWallet(wallets)

      // Here we check non-hardware wallets. Hardware wallets will always be on the correct
      // chain as onboard is only ever initialised with the current chain config
      const isWrongChain = wallet && wallet.chainId !== chainId
      if (isWrongChain) {
        await onboard.setChain({ wallet: wallet.label, chainId: hexValue(parseInt(chainId)) })
      }
    } catch {
      return
    } finally {
      setIsConnecting(false)
    }
  }

  const onContinue = async () => {
    router.push(AppRoutes.activity)
  }

  return (
    <div className={css.milesReceipt}>
      <Stack className={css.leftReceipt} justifyContent="space-between">
        <SvgIcon
          component={Asterix}
          inheritViewBox
          sx={{ color: 'transparent', position: 'absolute', top: 0, right: 0, height: 'inherit', width: 'inherit' }}
        />
        <SvgIcon component={SafeMiles} inheritViewBox sx={{ width: '154px', height: 'auto' }} />
        <Stack spacing={3} p={3}>
          <Typography variant="h2" fontWeight="bold">
            Interact with Safe and get rewards
          </Typography>
          <Typography>Short intro text about the program.</Typography>
          <Box>
            {isDisconnected ? (
              <Button variant="contained" color="primary" onClick={onConnect} disabled={isConnecting}>
                {isConnecting ? (
                  <Box display="flex" alignItems="center" flexDirection="row" gap={1}>
                    <Typography>Connecting</Typography>
                    <CircularProgress size={12} />
                  </Box>
                ) : (
                  'Connect wallet'
                )}
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={onContinue}>
                Continue
              </Button>
            )}
          </Box>
        </Stack>
      </Stack>

      <Stack className={css.rightReceipt} gap={3} justifyContent="center">
        <Typography variant="caption" textTransform="uppercase" letterSpacing="1px">
          What is the Safe{'{'}Miles{'}'} program?
        </Typography>
        <Stack gap={1}>
          <Step index={0} title="Lock SAFE to boost your miles!" active={stepsActive[0]} />
          <Step index={1} title="Earn miles for activity" active={stepsActive[1]} />
          <Step index={2} title="Get rewards for earned miles" active={stepsActive[2]} />
        </Stack>
        <Barcode className={css.barcode} />
      </Stack>
    </div>
  )
}
