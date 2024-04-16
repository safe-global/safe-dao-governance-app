import { Box, Button, Grid, IconButton, Modal, Stack, SvgIcon, Typography } from '@mui/material'
import css from './styles.module.css'
import SafePass from '@/public/images/safe-pass.svg'
import Barcode from '@/public/images/barcode.svg'
import { NorthRounded, SouthRounded } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import clsx from 'clsx'
import { formatAmount } from '@/utils/formatters'
import { floorNumber } from '@/utils/boost'

const MilesReceipt = ({
  open,
  onClose,
  amount,
  newFinalBoost,
  isUnlock = false,
}: {
  open: boolean
  onClose: () => void
  amount: string
  newFinalBoost: number
  isUnlock?: boolean
}) => {
  const ArrowIcon = isUnlock ? SouthRounded : NorthRounded

  return (
    <Modal open={open} onClose={onClose} slotProps={{ backdrop: { sx: { backgroundColor: '#636669BF' } } }}>
      <Box display="flex" flexDirection="column" alignContent="center">
        <Grid container direction="row" className={css.milesReceipt}>
          <div className={clsx(css.gradientBackground, { [css.unlockGradient]: isUnlock })} />

          <Grid item xs={12} md={8}>
            <Stack className={css.leftReceipt}>
              <SvgIcon component={SafePass} inheritViewBox sx={{ width: '282px', height: 'auto' }} />
              <Stack mt="auto">
                <Typography variant="h1" component="div" fontWeight="bold" mb={1}>
                  {isUnlock ? 'Your tokens are unlocked' : 'Welcome on board'}
                </Typography>
                <Typography mb={5}>
                  You successfully started {isUnlock ? 'unlocking' : 'locking'} {amount} SAFE. Once the transaction is
                  signed and executed the changes will be reflected in this App.
                  <br />
                  {isUnlock ? 'Withdrawal will be available in 24h' : ''}
                </Typography>

                {!isUnlock && (
                  <Stack direction="row" gap={2}>
                    {/* TODO: Need content to share message on Twitter */}
                    <Button variant="outlined" href="https://twitter.com/safe" target="_blank">
                      Share on X
                    </Button>
                    <Button variant="outlined" href="https://twitter.com/safe" target="_blank">
                      Follow Safe on X
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack className={css.rightReceipt} gap={3} justifyContent="center">
              <Typography variant="h4" fontWeight="bold">
                Your activity update
              </Typography>

              <Stack direction="row" alignItems="baseline">
                <ArrowIcon color={isUnlock ? 'warning' : 'primary'} fontSize="small" />
                <Typography
                  variant="h2"
                  component="div"
                  fontWeight="bold"
                  color={isUnlock ? 'warning.main' : 'primary'}
                >
                  {formatAmount(amount, 0)}
                </Typography>
                <Typography color="text.secondary" ml={1}>
                  Tokens {isUnlock ? 'unlocked' : 'locked'}
                </Typography>
              </Stack>

              <div>
                <Stack direction="row" alignItems="baseline">
                  <ArrowIcon color={isUnlock ? 'warning' : 'primary'} fontSize="small" />
                  <Typography
                    variant="h2"
                    component="div"
                    fontWeight="bold"
                    color={isUnlock ? 'warning.main' : 'primary'}
                  >
                    {formatAmount(floorNumber(newFinalBoost, 2), 2)}x
                  </Typography>
                  <Typography color="text.secondary" ml={1}>
                    Your new miles boost
                  </Typography>
                </Stack>
                <Typography>This boost will be applied to all your miles earned</Typography>
              </div>
              {!isUnlock && <Barcode className={css.barcode} />}
              <IconButton className={css.closeButton} onClick={onClose}>
                <CloseIcon fontSize="large" />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default MilesReceipt
