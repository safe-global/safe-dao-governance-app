import { Box, Divider, Link, SvgIcon, Typography } from '@mui/material'
import css from './styles.module.css'
import clsx from 'clsx'
import { SEASON1_START, SEASON2_START } from '@/config/constants'
import Diamond from '@/public/images/diamond.png'
import StarIcon from '@/public/images/star.svg'
import Image from 'next/image'
import { useOwnRank } from '@/hooks/useLeaderboard'
import { toDaysSinceStart } from '@/utils/date'
import Asterix from '@/public/images/asterix.svg'
import { AccordionContainer } from '@/components/AccordionContainer'

import PaperContainer from '../PaperContainer'
import { useStartDate } from '@/hooks/useStartDates'
import { AppRoutes } from '@/config/routes'
import NextLink from 'next/link'
import { ReactNode } from 'react'
import { NAVIGATION_EVENTS } from '@/analytics/navigation'
import Track from '../Track'

const Step = ({
  active,
  title,
  description,
}: {
  active: boolean
  title: ReactNode
  description: string
  activationDate?: string
}) => {
  return (
    <div className={clsx(css.step, { [css.activeStep]: active })}>
      <Typography variant="h4" fontWeight="bold" mb={1} display="flex" alignItems="center" gap={1}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {description}
      </Typography>
    </div>
  )
}

export const ActivityRewardsInfo = () => {
  const ownRankResult = useOwnRank()
  const { data: ownRank } = ownRankResult

  const { startTime } = useStartDate()
  const daysSinceStart = toDaysSinceStart(Date.now(), startTime)
  const stepsActive = [daysSinceStart >= 0, daysSinceStart >= SEASON1_START, daysSinceStart >= SEASON2_START]

  return (
    <AccordionContainer title="How the program works">
      <Box display="flex" flexDirection="column">
        <PaperContainer sx={{ position: 'relative', overflow: 'hidden' }}>
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
              title="Lock SAFE to boost your miles!"
              description="Lock your SAFE tokens early and increase your mile earning power. The earlier and more you lock, the bigger
          your miles multiplier."
            />

            <Step
              active={stepsActive[1]}
              activationDate="June 10"
              title={
                <>
                  Get activity miles
                  {!stepsActive[1] && (
                    <Typography variant="caption" component="span" className={css.comingSoon}>
                      Coming soon
                    </Typography>
                  )}
                </>
              }
              description="Earn miles by using your Safe Account. Your miles are multiplied by the boost you build until September 30."
            />

            <Step
              active={stepsActive[2]}
              activationDate="September 30"
              title="Get rewards from your activity miles!"
              description="Get rewards from your boosted activity miles! A higher ranking provides higher chances for rewards."
            />
          </div>

          <div className={css.rewards}>
            <div className={css.rewardsBackground} />

            <div className={css.diamondImage}>
              <Image src={Diamond} alt="Diamond image" width={200} height={200} />
            </div>

            <Typography variant="h1" fontWeight={700} textAlign="center" mt={-3} mb={1} className={css.gradientText}>
              SAFE Tokens
            </Typography>
            <Typography textAlign="center">2.5M SAFE to be distributed</Typography>

            <Typography textAlign="center" color="text.secondary" mt={10} mb={1}>
              More rewards
            </Typography>
            <Typography
              sx={{
                border: ({ palette }) => `1px solid ${palette.primary.main}`,
                borderRadius: '6px',
                width: 'fit-content',
                margin: 'auto',
                padding: 1,
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              Coming soon
            </Typography>
          </div>

          <Divider />
          <Track {...NAVIGATION_EVENTS.OPEN_ACTIVITY_INFO}>
            <Link href="#" sx={{ textAlign: 'center', fontSize: '14px' }}>
              More info about Activity Miles
            </Link>
          </Track>
        </PaperContainer>
        <Track {...NAVIGATION_EVENTS.OPEN_TERMS}>
          <Link href={AppRoutes.terms} component={NextLink} m={2} sx={{ textAlign: 'center' }}>
            Terms and Conditions
          </Link>
        </Track>
      </Box>
    </AccordionContainer>
  )
}
