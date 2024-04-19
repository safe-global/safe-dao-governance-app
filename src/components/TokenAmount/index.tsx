import { Paper, Stack, Typography, Grid, Skeleton, Box } from '@mui/material'
import { formatUnits } from 'ethers/lib/utils'
import { Odometer } from '../Odometer'

import SafeToken from '@/public/images/token.svg'
import css from './styles.module.css'
import { BigNumberish } from 'ethers'

export const TokenAmount = ({ loading, amount, label }: { loading: boolean; amount: BigNumberish; label: string }) => {
  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: ({ palette }) => palette.background.default,
        color: ({ palette }) => palette.text.primary,
        position: 'relative',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" className={css.content}>
        <SafeToken width={48} height={48} />
        <Box>
          <Typography color="text.secondary">{label}</Typography>

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
                  <Odometer value={Number(formatUnits(amount ?? '0', 18))} decimals={0} /> SAFE
                </>
              )}
            </Typography>
          </Grid>
        </Box>
      </Stack>
    </Paper>
  )
}
