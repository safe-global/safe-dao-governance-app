import { InfoOutlined } from '@mui/icons-material'
import { Grid, Paper, Typography, Tooltip, Skeleton, Stack, Box } from '@mui/material'
import { BigNumberish } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { Odometer } from '../Odometer'

import SafeToken from '@/public/images/token.svg'

import css from './styles.module.css'

export const UnlockStats = ({
  currentlyLocked,
  unlockedTotal,
}: {
  currentlyLocked: BigNumberish
  unlockedTotal: BigNumberish
}) => {
  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={6}>
        <Paper
          sx={{
            p: 3,
            backgroundColor: ({ palette }) => palette.background.default,
            color: ({ palette }) => palette.text.primary,
            position: 'relative',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <SafeToken width={48} height={48} />
            <Box>
              <Typography color="text.secondary">Locked</Typography>

              <Grid item display="flex" alignItems="center">
                <Typography
                  variant="h3"
                  variantMapping={{
                    h3: 'span',
                  }}
                  className={css.amountDisplay}
                >
                  <Odometer value={Number(formatUnits(currentlyLocked ?? '0', 18))} decimals={2} /> SAFE
                </Typography>
              </Grid>
            </Box>
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <Paper
          sx={{
            p: 3,
            backgroundColor: ({ palette }) => palette.background.default,
            color: ({ palette }) => palette.text.primary,
            position: 'relative',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <SafeToken width={48} height={48} />
            <Box>
              <Typography color="text.secondary">Unlocked</Typography>

              <Grid item display="flex" alignItems="center">
                <Typography
                  variant="h3"
                  variantMapping={{
                    h3: 'span',
                  }}
                  className={css.amountDisplay}
                >
                  <Odometer value={Number(formatUnits(unlockedTotal ?? '0', 18))} decimals={2} /> SAFE
                </Typography>
              </Grid>
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  )
}
