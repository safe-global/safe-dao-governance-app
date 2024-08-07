import {
  Box,
  Link,
  Paper,
  Skeleton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { Identicon } from '../Identicon'
import FirstPlaceIcon from '@/public/images/leaderboard-first-place.svg'
import SecondPlaceIcon from '@/public/images/leaderboard-second-place.svg'
import ThirdPlaceIcon from '@/public/images/leaderboard-third-place.svg'
import TitleStar from '@/public/images/leaderboard-title-star.svg'
import FlashIcon from '@/public/images/flash.svg'
import { CampaignLeaderboardEntry, useGlobalCampaignLeaderboardPage, useOwnCampaignRank } from '@/hooks/useLeaderboard'
import { ReactElement, useState } from 'react'
import { useEnsLookup } from '@/hooks/useEnsLookup'
import Track from '../Track'
import { NAVIGATION_EVENTS } from '@/analytics/navigation'
import { useChainId } from '@/hooks/useChainId'
import { CHAIN_SHORT_NAME, SAFE_URL } from '@/config/constants'
import { ExternalLink } from '../ExternalLink'
import { Campaign } from '@/hooks/useCampaigns'
import { floorNumber } from '@/utils/boost'
import { useGlobalCampaignId } from '@/hooks/useGlobalCampaignId'

const PAGE_SIZE = 10

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'none',
    color: theme.palette.common.white,
    border: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderTop: `1px ${theme.palette.background.paper} solid`,
    borderBottom: `1px ${theme.palette.background.paper} solid`,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:hover td': {
    backgroundColor: theme.palette.background.main,
  },
  '& td:first-child': {
    borderRadius: '6px 0 0 6px',
  },
  '& td:last-child': {
    borderRadius: '0 6px 6px 0',
  },
}))

const HighlightedTableRow = styled(TableRow)(({ theme }) => ({
  '& td:first-child': {
    borderRadius: '6px 0 0 6px',
  },
  '& td:last-child': {
    borderRadius: '0 6px 6px 0',
  },
  '& td': {
    backgroundColor: theme.palette.background.light,
    background:
      'linear-gradient(var(--mui-palette-background-light), var(--mui-palette-background-light)) padding-box,linear-gradient(to bottom, #5FDDFF 12.5%, #12FF80 88.07%) border-box',
    border: '1px solid transparent !important',
  },
  '& td:not(:first-child)': {
    borderLeft: 'none !important',
  },
  '& td:not(:last-child)': {
    borderRight: 'none !important',
  },
}))

const StyledTable = styled(Table)(({ theme }) => ({
  borderCollapse: 'separate',
}))

export const shortenAddress = (address: string, length = 4): string => {
  if (!address) {
    return ''
  }

  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

const LookupAddress = ({ address }: { address: string }) => {
  const name = useEnsLookup(address)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const displayAddress = isSmallScreen ? shortenAddress(address) : address
  const chainId = useChainId()
  const shortName = CHAIN_SHORT_NAME[chainId]

  return (
    <>
      <Box display="flex" flexDirection="row" gap={2} alignItems="center">
        <Identicon size={32} address={address}></Identicon>
        {shortName ? (
          <ExternalLink href={`${SAFE_URL}/home?safe=${shortName}:${address}`}>
            {name ? name : displayAddress}
          </ExternalLink>
        ) : (
          <Typography>{name ? name : displayAddress}</Typography>
        )}
      </Box>
    </>
  )
}

const Ranking = ({ position }: { position: number }) => {
  return position <= 3 ? (
    <SvgIcon
      component={position === 1 ? FirstPlaceIcon : position === 2 ? SecondPlaceIcon : ThirdPlaceIcon}
      justifyContent="center"
      inheritViewBox
      fontSize="medium"
      sx={{ pt: '5px' }}
    />
  ) : (
    <>{position}</>
  )
}

const OwnEntry = ({ entry }: { entry: CampaignLeaderboardEntry | undefined }) => {
  if (entry) {
    return (
      <HighlightedTableRow key={entry.holder}>
        <StyledTableCell align="center">
          <Ranking position={entry.position} />
        </StyledTableCell>
        <StyledTableCell align="left">
          <LookupAddress address={entry.holder} />
        </StyledTableCell>
        <StyledTableCell align="left">{floorNumber(entry.totalBoostedPoints, 0)}</StyledTableCell>
      </HighlightedTableRow>
    )
  }

  return null
}

const LeaderboardPage = ({
  index,
  resourceId,
  onLoadMore,
  ownEntry,
}: {
  index: number
  resourceId: string | undefined
  onLoadMore?: () => void
  ownEntry: CampaignLeaderboardEntry | undefined
}): ReactElement => {
  const leaderboardPage = useGlobalCampaignLeaderboardPage(resourceId, PAGE_SIZE, index * PAGE_SIZE)
  const rows = leaderboardPage?.results ?? []
  const isLeaderboardEmpty = index === 0 && (!rows || rows.length === 0)

  if (leaderboardPage === undefined) {
    return (
      <>
        <StyledTableRow>
          <StyledTableCell align="center">
            <Skeleton />
          </StyledTableCell>
          <StyledTableCell align="left">
            <Skeleton />
          </StyledTableCell>
          <StyledTableCell align="left">
            <Skeleton />
          </StyledTableCell>
        </StyledTableRow>
      </>
    )
  }
  if (isLeaderboardEmpty) {
    return (
      <>
        <StyledTableRow>
          <StyledTableCell colSpan={3}>
            <Stack spacing={2} alignItems="center" justifyItems="center" mt={10}>
              <FlashIcon />
              <Typography variant="subtitle1" textAlign="center">
                Be active to earn your points.
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Check back to see how you scored compared to others when the campaign ends.
              </Typography>
            </Stack>
          </StyledTableCell>
        </StyledTableRow>
      </>
    )
  }
  return (
    <>
      {rows.map((row) => {
        return row.holder === ownEntry?.holder ? (
          <OwnEntry entry={ownEntry} />
        ) : (
          <StyledTableRow key={row.holder}>
            <StyledTableCell align="center">
              <Ranking position={row.position} />
            </StyledTableCell>
            <StyledTableCell align="left">
              <LookupAddress address={row.holder} />
            </StyledTableCell>
            <StyledTableCell align="left">{floorNumber(row.totalBoostedPoints, 0)}</StyledTableCell>
          </StyledTableRow>
        )
      })}
      {onLoadMore && leaderboardPage?.next && (
        <tr>
          <td colSpan={3} style={{ textAlign: 'center', padding: '8px' }}>
            <Track {...NAVIGATION_EVENTS.LEADERBOARD_SHOW_MORE}>
              <Link
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                onClick={onLoadMore}
              >
                Show more
              </Link>
            </Track>
          </td>
        </tr>
      )}
    </>
  )
}

export const CampaignLeaderboard = ({ campaign }: { campaign?: Campaign }) => {
  const [pages, setPages] = useState(1)
  const { data: ownEntry } = useOwnCampaignRank(campaign?.resourceId)

  const globalCampaignId = useGlobalCampaignId()

  const isGlobal = campaign?.resourceId === globalCampaignId

  return (
    <Box key={campaign?.resourceId}>
      <Stack direction="row" width="100%" justifyContent="space-between">
        <Stack spacing={1}>
          <Typography fontSize="16px" lineHeight="22px" letterSpacing="0.15px">
            Leaderboard
          </Typography>
          <Typography variant="h3" fontWeight={700} fontSize="32px">
            {isGlobal ? 'Global' : campaign?.name} standings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isGlobal
              ? 'Participate in Partner campaigns and regular Safe activities to score in this leaderboard.'
              : 'Your standing in this campaign. Participate for rewards from the campaign partner.'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          {isGlobal && (
            <>
              <SvgIcon component={TitleStar} inheritViewBox sx={{ width: '40px', height: '40px' }} />
              <SvgIcon component={TitleStar} inheritViewBox sx={{ width: '40px', height: '40px' }} />
            </>
          )}
          <SvgIcon component={TitleStar} inheritViewBox sx={{ width: '40px', height: '40px' }} />
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <StyledTable aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="left">
                <Typography color="text.secondary">Points gained</Typography>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ownEntry && ownEntry?.position > PAGE_SIZE && <OwnEntry entry={ownEntry} />}
            {Array.from(new Array(pages)).map((_, index) => (
              <LeaderboardPage
                index={index}
                resourceId={campaign?.resourceId}
                key={index}
                onLoadMore={index === pages - 1 ? () => setPages((prev) => prev + 1) : undefined}
                ownEntry={ownEntry}
              />
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Box>
  )
}
