import { Box, Button, LinearProgress, Stack, SvgIcon, Typography } from '@mui/material'
import PaperContainer from '../PaperContainer'
import MorhoIcon from '@/public/images/morpho.svg'
import SpotlightIcon from '@/public/images/spotlight.svg'

import css from './styles.module.css'
import { Campaign } from '@/hooks/useCampaigns'

export const CampaignPromo = ({ campaign }: { campaign?: Campaign }) => {
  return (
    <PaperContainer sx={{ overflow: 'hidden' }}>
      <LinearProgress
        className={css.progressBar}
        variant="determinate"
        value={60}
        sx={{
          mt: '-40px',
          ml: '-32px',
          mr: '-32px',
        }}
      />
      <Stack alignItems="center">
        <Typography variant="body2" color="text.secondary" mb={2}>
          Ends in 2 weeks
        </Typography>
        <Box position="relative">
          <SvgIcon
            component={SpotlightIcon}
            inheritViewBox
            sx={{
              position: 'absolute',
              top: 0,
              left: '-21px',
              width: '42px',
              height: '56px',
            }}
          />
          <SvgIcon
            component={MorhoIcon}
            inheritViewBox
            sx={{
              width: '148px',
              height: '100px',
            }}
          />
          <SvgIcon
            component={SpotlightIcon}
            inheritViewBox
            sx={{
              position: 'absolute',
              top: 0,
              right: '-21px',
              width: '42px',
              height: '56px',
              transform: 'rotateY(180deg)',
            }}
          />
        </Box>

        <Typography mt={5} variant="overline" color="text.secondary">
          Prize pool
        </Typography>
        <Typography mt={1} variant="h4" fontSize="27px" fontWeight={700}>
          600,000 <span style={{ color: '#2470FF' }}>MORPHO</span>
        </Typography>
        <Typography variant="body2">& Safe points</Typography>
        <Typography variant="body2" color="text.secondary" mt={5}>
          Learn more and participate in campaign:
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2} mt={2}>
          <Button variant="outlined" size="small" color="primary">
            Open Safe App
          </Button>
          <Typography>or</Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{
              color: '#2470FF',
              '&:hover': {
                backgroundColor: ({ palette }) => `rgba(36, 112, 255, ${palette.action.hoverOpacity})`,
              },
            }}
          >
            Go to Morpho
          </Button>
        </Stack>
      </Stack>
    </PaperContainer>
  )
}
