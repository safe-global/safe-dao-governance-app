import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Box, Button, Typography, Link, Skeleton, Card, IconButton } from '@mui/material'
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined'
import CheckSharpIcon from '@mui/icons-material/CheckSharp'
import { useState } from 'react'
import type { TypographyProps } from '@mui/material'
import type { ReactElement } from 'react'

import { ExternalLink } from '@/components/ExternalLink'
import SafeToken from '@/public/images/token.svg'
import { DISCORD_URL, FORUM_URL } from '@/config/constants'
import { getGovernanceAppSafeAppUrl } from '@/utils/safe-apps'
import { useDelegate } from '@/hooks/useDelegate'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { SelectedDelegate } from '@/components/SelectedDelegate'
import { formatAmount } from '@/utils/formatters'

import css from './styles.module.css'

const WIDGET_WIDTH = '300px'
const CHECKMARK_COLOR = '#B2BBC0'

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
        <ExternalLink href={FORUM_URL}>Safe{`{DAO}`} Forum</ExternalLink> and our{' '}
        <ExternalLink href={DISCORD_URL}>Discord</ExternalLink>.
      </Subtitle>
    </div>
  )
}

const DelegateAction = (): ReactElement => {
  const [isHover, setIsHover] = useState(false)

  return (
    <IconButton
      className={css.action}
      sx={{
        backgroundColor: ({ palette }) =>
          `${isHover ? palette.secondary.background : palette.background.default} !important`,
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {isHover ? <ModeEditOutlinedIcon /> : <CheckSharpIcon sx={{ '& path': { fill: CHECKMARK_COLOR } }} />}
    </IconButton>
  )
}

const VotingPowerWidget = (): ReactElement => {
  const { safe } = useSafeAppsSDK()
  const delegate = useDelegate()
  const { data: allocation } = useSafeTokenAllocation()

  const totalClaimed = allocation?.vestingData.reduce((acc, { amountClaimed }) => {
    return acc.add(amountClaimed)
  }, BigNumber.from(0))

  const hasUnredeemedAllocation = allocation?.vestingData.some(({ isExpired, isRedeemed }) => !isExpired && !isRedeemed)

  const claimingSafeAppUrl = getGovernanceAppSafeAppUrl(safe.chainId.toString(), safe.safeAddress)

  return (
    <>
      <div>
        <Title>Your voting power</Title>
        <Button href={claimingSafeAppUrl} target="_blank" rel="noopener noreferrer" className={css.button}>
          <SafeToken height={24} width={24} />
          <Title color="text.primary">
            {allocation?.votingPower ? formatAmount(Number(formatEther(allocation.votingPower)), 2) : <Skeleton />}{' '}
          </Title>
        </Button>
      </div>

      {totalClaimed?.gt(0) ? (
        <>
          <Subtitle>
            You&apos;ve already claimed{' '}
            <Typography variant="inherit" component="span" color="text.primary">
              {formatAmount(Number(formatEther(totalClaimed)), 2)} SAFE
            </Typography>
          </Subtitle>
          {delegate && (
            <Box width={1}>
              <Link href={claimingSafeAppUrl} rel="noopener noreferrer" target="_blank" underline="none">
                <SelectedDelegate delegate={delegate} shortenAddress action={<DelegateAction />} />
              </Link>
            </Box>
          )}
        </>
      ) : (
        <>
          {hasUnredeemedAllocation && <Subtitle>You have unredeemed tokens.</Subtitle>}
          <Link
            href={claimingSafeAppUrl}
            rel="noopener noreferrer"
            target="_blank"
            display="inline-flex"
            alignItems="center"
            underline="none"
          >
            <Button size="large" variant="contained" disableElevation fullWidth>
              {hasUnredeemedAllocation ? 'Claim and delegate' : 'Delegate'}
            </Button>
          </Link>
        </>
      )}
    </>
  )
}

export const ClaimingWidget = (): ReactElement => {
  const { data: allocation, isLoading } = useSafeTokenAllocation()

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
        {allocation?.votingPower.eq(0) ? <CtaWidget /> : <VotingPowerWidget />}
      </Box>
    </Card>
  )
}
