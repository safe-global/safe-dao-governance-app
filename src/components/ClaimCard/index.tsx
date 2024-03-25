import { ShieldOutlined } from '@mui/icons-material'
import { Grid, Paper, Typography, Tooltip, Badge } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { formatEther } from 'ethers/lib/utils'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import type { ReactElement } from 'react'

import SingleGreenTile from '@/public/images/single-green-tile.svg'
import DoubleGreenTile from '@/public/images/double-green-tile.svg'
import { formatAmount } from '@/utils/formatters'
import { Odometer } from '@/components/Odometer'

import css from './styles.module.css'

export const ClaimCard = ({
  isGuardian,
  ecosystemAmount,
  totalAmount,
  variant,
  decimals,
}: {
  isGuardian: boolean
  ecosystemAmount: string
  totalAmount: string
  variant: 'claimable' | 'vesting'
  decimals: number
}): ReactElement => {
  const ecosystemAmountInEth = formatEther(ecosystemAmount)
  const totalAmountInEth = formatEther(totalAmount)
  const numericalTotalAmountInEth = Number(totalAmountInEth)

  const isClaimable = variant === 'claimable'

  return (
    <Paper sx={{ p: 3, backgroundColor: 'background.default', position: 'relative' }}>
      <Typography marginBottom={3} fontWeight={700}>
        {isClaimable ? 'Claim now' : 'Claim at the end of the season'}

        {!isClaimable && (
          <Tooltip
            title={<Typography>Linear vesting over 4 years from a starting date of 27.09.2022</Typography>}
            arrow
            placement="top"
          >
            <InfoOutlined sx={{ color: 'border.main', height: '16px', width: '16px', mb: '-2px', ml: 1 }} />
          </Tooltip>
        )}
      </Typography>

      <Grid container direction="column">
        <Grid item display="flex" gap={1} alignItems="center">
          <Typography variant="subtitle2" color="text.primary">
            Total
          </Typography>
          <Tooltip
            title={
              <Typography>
                {isGuardian ? (
                  <>
                    This includes a Safe Guardian allocation of{' '}
                    <strong>{formatAmount(ecosystemAmountInEth, 2)} SAFE</strong>
                  </>
                ) : (
                  'Not eligible for Safe Guardian allocation. Contribute to the community to become a Safe Guardian.'
                )}
              </Typography>
            }
            arrow
            placement="top"
          >
            <Badge
              variant="dot"
              color="secondary"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              className={css.badge}
            >
              <ShieldOutlined
                sx={{
                  height: '16px',
                  width: '16px',
                }}
              />
            </Badge>
          </Tooltip>
        </Grid>
        <Grid item display="flex" alignItems="center">
          <Typography
            variant="h3"
            variantMapping={{
              h3: 'span',
            }}
            className={css.amountDisplay}
          >
            <Odometer value={Number(totalAmountInEth)} decimals={decimals} /> SAFE
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}
