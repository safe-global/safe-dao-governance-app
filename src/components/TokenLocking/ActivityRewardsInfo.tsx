import { Box, Divider, Link, SvgIcon, Typography } from '@mui/material'
import css from './styles.module.css'
import clsx from 'clsx'
import { SEASON1_START, SEASON2_START } from '@/config/constants'
import StarIcon from '@/public/images/star.svg'
import { useOwnRank } from '@/hooks/useLeaderboard'
import { toDaysSinceStart } from '@/utils/date'
import Asterix from '@/public/images/asterix.svg'
import { AccordionContainer } from '@/components/AccordionContainer'

import PaperContainer from '../PaperContainer'
import { useStartDate } from '@/hooks/useStartDates'
import { ReactNode } from 'react'

const Step = ({ active, title, description }: { active: boolean; title?: ReactNode; description?: string }) => {
  return (
    <div className={clsx(css.step, { [css.activeStep]: active })}>
      <Typography variant="h4" fontWeight="bold" mb={1} pr={10}>
        {title}
        {!active && (
          <Typography variant="caption" whiteSpace="nowrap" component="span" className={css.comingSoon}>
            Coming soon
          </Typography>
        )}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" mb={2}>
          {description}
        </Typography>
      )}
    </div>
  )
}

export const ActivityRewardsInfo = () => {
  const ownRankResult = useOwnRank()
  const { data: ownRank } = ownRankResult

  const { startTime } = useStartDate()
  const daysSinceStart = toDaysSinceStart(Date.now(), startTime)
  const stepsActive = [daysSinceStart >= 0, daysSinceStart >= SEASON1_START, daysSinceStart >= SEASON2_START, false]

  return (
    <AccordionContainer title="How the program works">
      <Box display="flex" flexDirection="column">
        <PaperContainer sx={{ position: 'relative', overflow: 'hidden' }}>
          <Box className={css.sidebarGradientBackground}></Box>
          <SvgIcon
            component={Asterix}
            inheritViewBox
            sx={{ color: 'transparent', position: 'absolute', top: 0, right: 0, height: '208px', width: 'inherit' }}
          />

          <div className={css.steps}>
            {ownRank && (
              <>
                <Typography variant="overline" fontWeight="bold" color="text.secondary" mb="6px">
                  Your current ranking
                </Typography>
                <Typography variant="h3" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                  <SvgIcon component={StarIcon} inheritViewBox />#{ownRank.position}
                </Typography>
              </>
            )}
            <Typography variant="h1" fontWeight={700} mt="52px" mb="40px" maxWidth="60%" className={css.gradientText}>
              Interact with Safe and get rewards
            </Typography>
            <Step
              active={stepsActive[0]}
              title="Lock SAFE to boost Points"
              description="Lock your tokens early to increase your earning power. The earlier and more you lock, the bigger your points multiplier. Geographic & other limitations apply (see disclaimer below)v"
            />
            <Step
              active={stepsActive[1]}
              title="Get activity Points"
              description="Earn Points by using your Safe Account. Your Points are multiplied by the realised boost."
            />
            <Step
              active={stepsActive[2]}
              title="Get rewards from your activity Points"
              description="A higher ranking provides higher chances for rewards."
            />
            <Typography variant="h4" display="flex" fontWeight="bold" alignItems="center">
              <SvgIcon component={StarIcon} sx={{ mr: 2 }} inheritViewBox />
              Repeat!
            </Typography>
          </div>

          <Divider />

          <Link href="#" sx={{ textAlign: 'center', fontSize: '14px' }}>
            View eligible activities
          </Link>
        </PaperContainer>
      </Box>
    </AccordionContainer>
  )
}
