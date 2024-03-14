import { useWallet } from '@/hooks/useWallet'
import { RsvpTwoTone } from '@mui/icons-material'
import {
  Box,
  Chip,
  Paper,
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

export const Leaderboard = () => {
  const wallet = useWallet()

  const ownAddress = wallet?.address ?? '0x85380007DF137839015C2C1254c4b6cec130C589'
  const rows = [
    {
      rank: 600,
      address: ownAddress,
      name: undefined,
      amountLocked: 3000,
    },
    {
      rank: 1,
      address: '0x3819b800c67Be64029C1393c8b2e0d0d627dADE2',
      name: 'loremipsum.eth',
      amountLocked: 20192938,
    },
    {
      rank: 2,
      address: '0x8803523c9Cc0F948C66FA906ac9065CB03fDc9A3',
      name: undefined,
      amountLocked: 1374464,
    },
    {
      rank: 3,
      address: '0x46f3451faA4A00D14B02ba55C2437B96FA3d0981',
      name: undefined,
      amountLocked: 955430,
    },
    {
      rank: 4,
      address: '0xB5E64e857bb7b5350196C5BAc8d639ceC1072745',
      name: 'usame.eth',
      amountLocked: 874900,
    },
    {
      rank: 5,
      address: '0x46f3451faA4A00D14B02ba55C2437B96FA3d0981',
      name: undefined,
      amountLocked: 600000,
    },
    {
      rank: 6,
      address: '0x8803523c9Cc0F948C66FA906ac9065CB03fDc9A3',
      name: undefined,
      amountLocked: 505238,
    },
  ]
  return (
    <Box>
      <Typography variant="h2" fontWeight={700}>
        Leaderboard
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: -6 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="left">Tokens Locked</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow
                key={row.name}
                sx={
                  ownAddress === row.address
                    ? {
                        backgroundColor: ({ palette }) => palette.background.main,
                      }
                    : undefined
                }
              >
                <StyledTableCell align="center">
                  {row.rank <= 3 ? (
                    <SvgIcon
                      component={row.rank === 1 ? FirstPlaceIcon : row.rank === 2 ? SecondPlaceIcon : ThirdPlaceIcon}
                      justifyContent="center"
                      inheritViewBox
                      fontSize={row.rank === 1 ? 'large' : row.rank === 2 ? 'medium' : 'small'}
                    />
                  ) : (
                    `#${row.rank}`
                  )}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                    <Identicon size={32} address={row.address}></Identicon>
                    {row.name ?? row.address}
                  </Box>
                </StyledTableCell>
                <StyledTableCell align="left">{row.amountLocked}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
