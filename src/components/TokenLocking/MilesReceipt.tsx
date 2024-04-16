import { Button, IconButton, Modal, Stack, SvgIcon, Typography } from '@mui/material'
import css from './styles.module.css'
import SafePass from '@/public/images/safe-pass.svg'
import { NorthRounded, SouthRounded } from '@mui/icons-material'
import XIcon from '@mui/icons-material/X'
import CloseIcon from '@mui/icons-material/Close'
import clsx from 'clsx'
import { formatAmount } from '@/utils/formatters'
import { floorNumber } from '@/utils/boost'
import { ExternalLink } from '@/components/ExternalLink'

const TWEET_CONTENT =
  "I'm excited to be part of the new Safe%7BPass%7D rewards program with @Safe! Earning points for using the most trusted smart wallet AND joining the Safe community? Win-win!"

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
          <SvgIcon component={SafePass} inheritViewBox sx={{ width: '130px', height: 'auto' }} />
          <Stack mt="auto" className={css.topReceipt}>
            <Typography variant="h1" component="div" fontWeight="bold" mb={1} mt={7}>
              {isUnlock ? 'Unclocking' : 'Locking'} started...
            </Typography>
            <Typography mb={4}>
              You successfully started {isUnlock ? 'unlocking' : 'locking'} {amount} SAFE. Once the transaction is
              signed and executed the changes will be reflected in this App.
              {isUnlock ? ' The tokens will be will be available to withdraw in 24h.' : ''}
            </Typography>

            {!isUnlock && (
              <Stack direction="row" gap={2} mb={2}>
                <ExternalLink
                  variant="button"
                  icon={false}
                  href={`https://twitter.com/intent/tweet?&text=${TWEET_CONTENT}`}
                >
                  Share on <XIcon sx={{ ml: 1, fontSize: '20px' }} />
                </ExternalLink>
                <ExternalLink variant="button" icon={false} href={`https://twitter.com/safe`}>
                  Follow Safe on <XIcon sx={{ ml: 1, fontSize: '20px' }} />
                </ExternalLink>
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
                  Your new final boost
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
