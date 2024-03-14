import {
  Box,
  Chip,
  Divider,
  Link,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  SvgIcon,
  Tooltip,
  Typography,
} from '@mui/material'
import css from './styles.module.css'
import { InfoOutlined } from '@mui/icons-material'
import StarIcon from '@/public/images/star4.svg'
import Asterix from '@/public/images/asterix.svg'
import { StartDateCard } from './StartDateCard'
import PaperContainer from '../PaperContainer'

export const ActivityRewardsInfo = () => {
  return (
    <Stack spacing={3}>
      <PaperContainer sx={{ position: 'relative' }}>
        <SvgIcon component={Asterix} inheritViewBox className={css.asterixIcon} />
        <Box>
          <Box>
            <Typography variant="overline" color="primary.light" fontWeight={700}>
              Your current ranking
              <Tooltip title={<Typography>Placeholder text</Typography>} arrow placement="top">
                <InfoOutlined sx={{ height: '16px', width: '16px', mb: '-4px', ml: 1, color: 'text.secondary' }} />
              </Tooltip>
            </Typography>
            <Typography variant="h1" fontStyle="italic" fontWeight={700}>
              <SvgIcon
                component={StarIcon}
                inheritViewBox
                fontSize="inherit"
                sx={{ height: '25px', width: '25px', mr: '3px' }}
              />
              #600
            </Typography>
          </Box>

          <Typography variant="h1" width="70%" className={css.rewardsInfoTitle} mt={8} mb={5}>
            Interact with Safe and get rewards
          </Typography>
          <Stepper activeStep={0} orientation="vertical" className={css.list}>
            <Step>
              <StepLabel>
                <Typography fontWeight={700} variant="h4" color="text.primary">
                  Lock SAFE to boost your miles!
                </Typography>
              </StepLabel>
              <StepContent TransitionProps={{ in: true }}>
                <Typography color="primary.light">
                  Lock your SAFE tokens early and increase your mile earning power. The earlier and more you lock, the
                  bigger your miles multiplier.
                </Typography>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>
                <Typography fontWeight={700} variant="h4" color="text.primary" className={css.chip}>
                  Get activity miles <Chip label="Coming soon" color="primary" sx={{ ml: 2 }}></Chip>
                </Typography>
              </StepLabel>
              <StepContent TransitionProps={{ in: true }}>
                <Typography color="primary.light">
                  Earn miles by using your Safe Account. Your miles are multiplied by the boost you build until
                  September 30.
                </Typography>
                <StartDateCard date="June 10" />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>
                <Typography fontWeight={700} variant="h4" color="text.primary">
                  Get rewards from your activity miles!
                </Typography>
              </StepLabel>
              <StepContent TransitionProps={{ in: true }}>
                <Typography color="primary.light">
                  Get rewards from your boosted activity miles! A higher ranking provides higher chances for rewards.
                </Typography>
                <StartDateCard date="September 10" />
              </StepContent>
            </Step>
          </Stepper>
          <Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <img width="218px" height="218px" src="/images/diamond.png" alt="diamond"></img>
              <Typography mt={-5} mb={2} className={css.rewardsInfoTitle} variant="h1">
                SAFE Tokens
              </Typography>
              <Typography>2.5M SAFE to be distributed</Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <img width="218px" height="218px" src="/images/diamond.png" alt="diamond"></img>
              <Typography mt={-5} mb={2} className={css.rewardsInfoTitle} variant="h1">
                Lottery
              </Typography>
              <Typography width="50%" textAlign="center">
                250k SAFE - 50k SAFE to be given to 5 Safe Miles participants
              </Typography>
            </Box>
            <Divider sx={{ my: 4 }} />
            <Box display="flex" flexDirection="column" alignItems="center">
              <Link href="" color="inherit">
                <Typography sx={{ m: '8px 32px ', fontSize: '14px' }}>More info about Activity Miles</Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </PaperContainer>
    </Stack>
  )
}
