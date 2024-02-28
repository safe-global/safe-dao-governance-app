import { InfoOutlined } from '@mui/icons-material'
import { Grid, Paper, Typography, Tooltip, Skeleton } from '@mui/material'
import { BigNumberish } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { Odometer } from '../Odometer'

import css from './styles.module.css'

export const CurrentStats = ({
  loading,
  safeBalance,
  currentlyLocked,
}: {
  safeBalance: BigNumberish
  currentlyLocked: BigNumberish
  loading: boolean
}) => {
  return (
    <Grid container direction="row" spacing={3} justifyContent="space-evenly">
      <Grid item xs={2}>
        <Paper
          sx={{
            p: 3,
            backgroundColor: ({ palette }) => palette.background.default,
            color: ({ palette }) => palette.text.primary,
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Typography variant="h3" fontWeight={700}>
            #600
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            Ranking
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={5}>
        <Paper
          sx={{
            p: 3,
            backgroundColor: ({ palette }) => palette.background.default,
            color: ({ palette }) => palette.text.primary,
            position: 'relative',
          }}
        >
          <Typography fontWeight={700}>
            Available
            <Tooltip title={<Typography>tbd</Typography>} arrow placement="top">
              <InfoOutlined
                sx={{
                  height: '16px',
                  width: '16px',
                  mb: '-2px',
                  ml: 1,
                }}
              />
            </Tooltip>
          </Typography>

          <Grid item display="flex" alignItems="center">
            <Typography
              variant="h3"
              variantMapping={{
                h3: 'span',
              }}
              className={css.amountDisplay}
            >
              {loading ? (
                <Skeleton />
              ) : (
                <>
                  <Odometer value={Number(formatUnits(safeBalance ?? '0', 18))} decimals={2} /> SAFE
                </>
              )}
            </Typography>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={5}>
        <Paper
          sx={{
            p: 3,
            backgroundColor: ({ palette }) => palette.primary.main,
            color: ({ palette }) => palette.background.default,
            position: 'relative',
          }}
        >
          <Typography fontWeight={700}>Locked</Typography>

          <Grid item display="flex" alignItems="center">
            <Typography
              variant="h3"
              variantMapping={{
                h3: 'span',
              }}
              className={css.amountDisplay}
            >
              <Odometer value={Number(formatUnits(currentlyLocked ?? 0, 18))} decimals={2} /> SAFE
            </Typography>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}
