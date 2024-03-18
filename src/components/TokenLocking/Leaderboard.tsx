import { useWallet } from '@/hooks/useWallet'
import {
  Box,
  Link,
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
import TitleStar from '@/public/images/leaderboard-title-star.svg'

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

const StyledTable = styled(Table)(({ theme }) => ({
  borderCollapse: 'separate',
  '& tr:first-child td': {
    backgroundColor: theme.palette.background.light,
    background:
      'linear-gradient(var(--mui-palette-background-light), var(--mui-palette-background-light)) padding-box,linear-gradient(to bottom, #5FDDFF 12.5%, #12FF80 88.07%) border-box',
    border: '1px solid transparent',
  },
  '& tr:first-child td:before': {},
  'tr:first-child td:not(:first-child)': {
    borderLeft: 'none',
  },
  '& tr:first-child td:not(:last-child)': {
    borderRight: 'none',
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
      <Box sx={{ display: 'flex' }}>
        <SvgIcon component={TitleStar} inheritViewBox sx={{ mr: '8px', mt: '4px' }} />
        <Box sx={{ flex: '1' }}>
          <Typography variant="h2" fontWeight={700} sx={{ mr: '8px', display: 'inline' }}>
            Leaderboard
          </Typography>
          <Typography
            variant="subtitle1"
            fontSize="small"
            sx={{ color: 'var(--mui-palette-text-secondary)', my: '8px', fontSize: '14px' }}
          >
            Higher ranking means higher chances to get rewards.
          </Typography>
        </Box>
        <Link href="" color="inherit">
          <Typography sx={{ m: '8px 32px ', fontSize: '14px' }}>How it works</Typography>
        </Link>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: -6 }}>
        <StyledTable sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="left">Tokens Locked</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell align="center">
                  {row.rank <= 3 ? (
                    <SvgIcon
                      component={row.rank === 1 ? FirstPlaceIcon : row.rank === 2 ? SecondPlaceIcon : ThirdPlaceIcon}
                      justifyContent="center"
                      inheritViewBox
                      fontSize={row.rank === 1 ? 'large' : row.rank === 2 ? 'medium' : 'small'}
                      sx={{ pt: '5px' }}
                    />
                  ) : (
                    `${row.rank}`
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
        </StyledTable>
      </TableContainer>
    </Box>
  )
}
