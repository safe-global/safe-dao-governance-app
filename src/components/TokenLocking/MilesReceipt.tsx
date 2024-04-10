import { Button, IconButton, Modal, Stack, SvgIcon, Typography } from '@mui/material'
import css from './styles.module.css'
import SafeExplorers from '@/public/images/safe-explorers.svg'
import { NorthRounded, SouthRounded } from '@mui/icons-material'
import XIcon from '@mui/icons-material/X'
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
      <>
        <div className={clsx(css.gradientBackground, { [css.unlockGradient]: isUnlock })} />
        <Stack className={css.milesReceipt}>
          <SvgIcon component={SafeExplorers} inheritViewBox sx={{ width: '282px', height: 'auto' }} />
          <Stack mt="auto" className={css.topReceipt}>
            <Typography variant="h1" component="div" fontWeight="bold" mb={1} mt={7}>
              {isUnlock ? 'Your tokens are unlocked' : 'Locking started...'}
            </Typography>
            <Typography mb={4}>
              You {isUnlock ? 'unlocked' : 'successfully started locking'} {amount} SAFE.
              {isUnlock ? (
                ' Withdrawal will be available in 24h'
              ) : (
                <>
                  <br />
                  Once the transaction is signed and executed the changes will be reflected in this App.
                </>
              )}
            </Typography>

            {!isUnlock && (
              <Stack direction="row" gap={2} mb={2}>
                {/* TODO: Need content to share message on Twitter */}
                <Button variant="outlined" href="https://twitter.com/safe" target="_blank">
                  Share on <XIcon sx={{ ml: 1, fontSize: '20px' }} />
                </Button>
                <Button variant="outlined" href="https://twitter.com/safe" target="_blank">
                  Follow Safe on <XIcon sx={{ ml: 1, fontSize: '20px' }} />
                </Button>
              </Stack>
            )}
          </Stack>
          <Stack gap={3} justifyContent="center" mt={6}>
            <Typography variant="h4" fontWeight="bold">
              Your activity update
            </Typography>

            <Stack direction="row" alignItems="baseline">
              <ArrowIcon color={isUnlock ? 'warning' : 'primary'} fontSize="small" />
              <Typography variant="h2" component="div" fontWeight="bold" color={isUnlock ? 'warning.main' : 'primary'}>
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
            </div>
            <IconButton className={css.closeButton} onClick={onClose}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </Stack>
        </Stack>
      </>
    </Modal>
  )
}

export default MilesReceipt
