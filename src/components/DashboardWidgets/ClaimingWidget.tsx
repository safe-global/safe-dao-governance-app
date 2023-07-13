import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Box, Button, Typography, Link, Skeleton, Card, IconButton, Grid, Tooltip } from '@mui/material'
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined'
import CheckSharpIcon from '@mui/icons-material/CheckSharp'
import { useState } from 'react'
import type { TypographyProps } from '@mui/material'
import type { ReactElement } from 'react'

import { ExternalLink } from '@/components/ExternalLink'
import SafeToken from '@/public/images/token.svg'
import { DISCORD_URL, FORUM_URL, SEP5_EXPIRATION_DATE } from '@/config/constants'
import { getGovernanceAppSafeAppUrl } from '@/utils/safe-apps'
import { useDelegate } from '@/hooks/useDelegate'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { SelectedDelegate } from '@/components/SelectedDelegate'
import { formatAmount } from '@/utils/formatters'
import { Sep5DeadlineChip } from '@/components/Sep5DeadlineChip'
import { TypographyChip } from '@/components/TypographyChip'
import { canRedeemSep5Airdrop } from '@/utils/airdrop'
import { useIsDarkMode } from '@/hooks/useIsDarkMode'

import css from './styles.module.css'

const WIDGET_WIDTH = '320px'
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
    <Box display="flex" flexDirection="column" justifyContent="center" height={WIDGET_HEIGHT} p={2}>
      <Title mb={2}>
        Become part of <i>Safe</i>&apos;s future
      </Title>
      <br />
      <Subtitle>
        Help us unlock ownership for everyone by joining the discussions on the{' '}
        <ExternalLink href={FORUM_URL}>Safe{`{DAO}`} Forum</ExternalLink> and our{' '}
        <ExternalLink href={DISCORD_URL}>Discord</ExternalLink>.
      </Subtitle>
    </Box>
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
  const canRedeemSep5 = canRedeemSep5Airdrop(allocation)

  const totalClaimed = allocation?.vestingData.reduce((acc, { amountClaimed }) => {
    return acc.add(amountClaimed)
  }, BigNumber.from(0))

  const hasUnredeemedAllocation = allocation?.vestingData.some(({ isExpired, isRedeemed }) => !isExpired && !isRedeemed)

  const claimingSafeAppUrl = getGovernanceAppSafeAppUrl(safe.chainId.toString(), safe.safeAddress)

  const hasClaimed = totalClaimed?.gt(0)

  return (
    <Grid container p={1} height={1}>
      {canRedeemSep5 && (
        <Grid item xs={12} display="flex" justifyContent="space-between" mb="auto">
          <TypographyChip fontWeight={700} px={1}>
            New allocation
          </TypographyChip>

          <Tooltip
            title={`You qualify for a new SAFE allocation! Ensure you execute at least one claim before ${SEP5_EXPIRATION_DATE}`}
            arrow
            placement="top"
          >
            <span>
              <Sep5DeadlineChip px={1} />
            </span>
          </Tooltip>
        </Grid>
      )}
      <Grid item xs={12} display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="subtitle2" color="primary.light" textAlign="center">
          Your voting power
        </Typography>
        <Link href={claimingSafeAppUrl} target="_blank" rel="noopener noreferrer" className={css.link}>
          <SafeToken height={24} width={24} />
          <Title color="text.primary">
            {allocation?.votingPower ? formatAmount(Number(formatEther(allocation.votingPower)), 2) : <Skeleton />}
          </Title>
        </Link>
        {hasClaimed && (
          <Subtitle mt={1}>
            Claimed{' '}
            <Typography variant="inherit" component="span" color="text.primary">
              {formatAmount(Number(formatEther(totalClaimed!)), 2)} SAFE
            </Typography>
          </Subtitle>
        )}
      </Grid>

      {hasClaimed && delegate && (
        <Grid item xs={12} p="0 24px 24px">
          <Link href={claimingSafeAppUrl} rel="noopener noreferrer" target="_blank" underline="none">
            <SelectedDelegate delegate={delegate} shortenAddress action={<DelegateAction />} />
          </Link>
        </Grid>
      )}

      {!hasClaimed && (
        <Grid item xs={12} display="flex" flexDirection="column" alignItems="center">
          {hasUnredeemedAllocation && <Subtitle>You have unredeemed Safe Tokens.</Subtitle>}
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
        </Grid>
      )}
    </Grid>
  )
}

export const ClaimingWidget = (): ReactElement => {
  const { data: allocation, isLoading } = useSafeTokenAllocation()
  const canRedeemSep5 = canRedeemSep5Airdrop(allocation)
  const isDarkMode = useIsDarkMode()

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
    <Card
      elevation={0}
      sx={{
        minWidth: WIDGET_WIDTH,
        maxWidth: WIDGET_WIDTH,
        border: canRedeemSep5
          ? ({ palette }) => (isDarkMode ? `1px solid ${palette.primary.main}` : `1px solid ${palette.secondary.main}`)
          : undefined,
      }}
    >
      <>{allocation?.votingPower.eq(0) ? <CtaWidget /> : <VotingPowerWidget />}</>
    </Card>
  )
}
