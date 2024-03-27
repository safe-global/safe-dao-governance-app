import {
  Box,
  Button,
  Link,
  Paper,
  Skeleton,
  SvgIcon,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { Identicon } from '../Identicon'
import FirstPlaceIcon from '@/public/images/leaderboard-first-place.svg'
import SecondPlaceIcon from '@/public/images/leaderboard-second-place.svg'
import ThirdPlaceIcon from '@/public/images/leaderboard-third-place.svg'
import TitleStar from '@/public/images/leaderboard-title-star.svg'
import { useGlobalLeaderboardPage, useOwnRank } from '@/hooks/useLeaderboard'
import { formatAmount } from '@/utils/formatters'
import { formatEther } from 'ethers/lib/utils'
import { ReactElement, useState } from 'react'
import { useEnsLookup } from '@/hooks/useEnsLookup'

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

const LookupAddress = ({ address }: { address: string }) => {
  const name = useEnsLookup(address)

  return (
    <>
      <Box display="flex" flexDirection="row" gap={2} alignItems="center">
        <Identicon size={32} address={address}></Identicon>
        {name ? name : address}
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

const OwnRank = () => {
  const ownRankResult = useOwnRank()
  const { data: ownRank } = ownRankResult

  if (ownRank) {
    return (
      <HighlightedTableRow key={ownRank.holder}>
        <StyledTableCell align="center">
          <Ranking position={ownRank.position} />
        </StyledTableCell>
        <StyledTableCell align="left">
          <LookupAddress address={ownRank.holder} />
        </StyledTableCell>
        <StyledTableCell align="left">{formatAmount(formatEther(ownRank.lockedAmount), 0)}</StyledTableCell>
      </HighlightedTableRow>
    )
  }

  return null
}

const LeaderboardPage = ({ index, onLoadMore }: { index: number; onLoadMore?: () => void }): ReactElement => {
  const LIMIT = 10
  const leaderboardPage = useGlobalLeaderboardPage(LIMIT, index * LIMIT)
  const rows = leaderboardPage?.results ?? []

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
  return (
    <>
      {rows.map((row) => (
        <StyledTableRow key={row.holder}>
          <StyledTableCell align="center">
            <Ranking position={row.position} />
          </StyledTableCell>
          <StyledTableCell align="left">
            <LookupAddress address={row.holder} />
          </StyledTableCell>
          <StyledTableCell align="left">{formatAmount(formatEther(row.lockedAmount), 0)}</StyledTableCell>
        </StyledTableRow>
      ))}
      {onLoadMore && leaderboardPage?.next && (
        <tr>
          <td colSpan={3} style={{ textAlign: 'center' }}>
            <Link
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
              onClick={onLoadMore}
            >
              Load more
            </Link>
          </td>
        </tr>
      )}
    </>
  )
}

export const Leaderboard = () => {
  const [pages, setPages] = useState(1)

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <SvgIcon component={TitleStar} inheritViewBox sx={{ mr: '8px', mt: '4px' }} />
        <Box sx={{ flex: '1' }}>
          <Typography variant="h2" fontWeight={700} sx={{ mr: '8px', display: 'inline' }}>
            Leaderboard
          </Typography>
          <Typography variant="subtitle1" fontSize="small" color="text.secondary" sx={{ my: '8px', fontSize: '14px' }}>
            Higher ranking means higher chances to get rewards.
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: -6 }}>
        <StyledTable sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="left">
                <Typography color="text.secondary">Tokens Locked</Typography>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <OwnRank />
            {Array.from(new Array(pages)).map((_, index) => (
              <LeaderboardPage
                index={index}
                key={index}
                onLoadMore={index === pages - 1 ? () => setPages((prev) => prev + 1) : undefined}
              />
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Box>
  )
}
