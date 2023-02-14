import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Box, Button, Typography, Link, Skeleton, Card } from '@mui/material'
import type { TypographyProps } from '@mui/material'
import type { ReactElement } from 'react'

import { ExternalLink } from '@/components/ExternalLink'
import SafeToken from '@/public/images/token.svg'
import { CHAIN_SHORT_NAME, DEPLOYMENT_URL, DISCORD_URL, FORUM_URL, SAFE_URL } from '@/config/constants'
import { useDelegate } from '@/hooks/useDelegate'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { SelectedDelegate } from '@/components/SelectedDelegate'
import { formatAmount } from '@/utils/formatters'

import css from './styles.module.css'

const WIDGET_WIDTH = '300px'

const Title = ({ children, ...props }: TypographyProps): ReactElement => (
  <Typography variant="h4" style={{ fontWeight: 'bold', textAlign: 'center' }} {...props}>
    {children}
  </Typography>
)

const Subtitle = ({ children, ...props }: TypographyProps): ReactElement => (
  <Typography
    variant="subtitle2"
    color="primary.light"
    style={{ marginBottom: '16px', textAlign: 'center' }}
    {...props}
  >
    {children}
  </Typography>
)

const WIDGET_HEIGHT = 300

const CtaWidget = (): ReactElement => {
  return (
    <div>
      <Title>Become part of Safe&apos;s future</Title>
      <br />
      <Subtitle>
        Help us unlock ownership for everyone by joining the discussions on the{' '}
        <ExternalLink href={FORUM_URL}>SafeDAO Forum</ExternalLink> and our{' '}
        <ExternalLink href={DISCORD_URL}>Discord</ExternalLink>.
      </Subtitle>
    </div>
  )
}

const VotingPowerWidget = (): ReactElement => {
  const { safe } = useSafeAppsSDK()
  const delegate = useDelegate()
  const { data } = useSafeTokenAllocation()

  const totalClaimed = data?.vestingData.reduce((acc, { amountClaimed }) => {
    return acc.add(amountClaimed)
  }, BigNumber.from(0))

  const hasUnredeemedAllocation = data?.vestingData.some(({ isExpired, isRedeemed }) => !isExpired && !isRedeemed)

  const claimingSafeAppUrl = `${SAFE_URL}/apps?safe=${CHAIN_SHORT_NAME}:${safe.safeAddress}&appUrl=${DEPLOYMENT_URL}`

  return (
    <>
      <div>
        <Title>Your voting power</Title>
        <Button
          href={claimingSafeAppUrl}
          target="_blank"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px',
            '&:hover': { backgroundColor: 'secondary.light' },
          }}
        >
          <SafeToken height={24} width={24} />
          <Title color="text.primary">
            {data?.votingPower ? formatAmount(Number(formatEther(data.votingPower)), 2) : <Skeleton />}{' '}
          </Title>
        </Button>
      </div>

      {totalClaimed?.gt(0) ? (
        <>
          <Subtitle>You&apos;ve already claimed {formatAmount(Number(formatEther(totalClaimed)), 2)} SAFE</Subtitle>
          {delegate && (
            <Box width={1}>
              <Link href={claimingSafeAppUrl} rel="noopener noreferrer" target="_blank" underline="none">
                <SelectedDelegate delegate={delegate} shortenAddress />
              </Link>
            </Box>
          )}
        </>
      ) : (
        <>
          {hasUnredeemedAllocation && (
            <Subtitle>
              You have unredeemed tokens. Claim any amount before the 27th of December or the tokens will be transferred
              back into the SafeDAO treasury.
            </Subtitle>
          )}
          <Link
            href={claimingSafeAppUrl}
            rel="noopener noreferrer"
            target="_blank"
            display="inline-flex"
            alignItems="center"
            underline="none"
          >
            <Button size="large" variant="contained" disableElevation fullWidth>
              Claim and delegate
            </Button>
          </Link>
        </>
      )}
    </>
  )
}

export const ClaimingWidget = (): ReactElement => {
  const { data, isLoading } = useSafeTokenAllocation()

  if (isLoading) {
    return (
      <Box
        height={`${WIDGET_HEIGHT}px`}
        sx={{
          minWidth: WIDGET_WIDTH,
          maxWidth: WIDGET_WIDTH,
        }}
      >
        <Skeleton variant="rounded" width="100%" height="100%" />
      </Box>
    )
  }

  return (
    <Card elevation={0} sx={{ minWidth: WIDGET_WIDTH, maxWidth: WIDGET_WIDTH }}>
      <Box className={css.spacer} sx={{ alignItems: 'center' }}>
        {data?.votingPower.eq(0) ? <CtaWidget /> : <VotingPowerWidget />}
      </Box>
    </Card>
  )
}
