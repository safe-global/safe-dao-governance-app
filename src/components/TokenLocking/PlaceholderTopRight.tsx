import { Divider, Link, Stack, SvgIcon, Typography } from '@mui/material'
import css from './styles.module.css'
import clsx from 'clsx'
import ClockIcon from '@/public/images/clock-alt.svg'
import { useChainId } from '@/hooks/useChainId'
import { CHAIN_START_TIMESTAMPS } from '@/config/constants'
import { ReactNode } from 'react'
import Diamond from '@/public/images/diamond.png'
import StarIcon from '@/public/images/star.svg'
import Image from 'next/image'

const JUNE_10_TIMESTAMP = 1718013600000
const SEPTEMBER_10_TIMESTAMP = 1725962400000

const Step = ({
  active,
  title,
  description,
  activationDate,
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

      {activationDate && (
        <Stack className={css.stepDate} direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="overline" fontWeight="bold" color="text.secondary">
            Starting
          </Typography>
          <Typography fontWeight="bold" display="flex" alignItems="center" gap={1}>
            <SvgIcon component={ClockIcon} inheritViewBox fontSize="inherit" />
            {activationDate}
          </Typography>
        </Stack>
      )}
    </div>
  )
}

export const PlaceholderTopRight = () => {
  const chainId = useChainId()
  const today = Date.now()

  const stepsActive = [
    today >= CHAIN_START_TIMESTAMPS[chainId],
    today >= JUNE_10_TIMESTAMP,
    today >= SEPTEMBER_10_TIMESTAMP,
  ]

  const mockRanking = 10000

  return (
    <>
      <div className={css.steps}>
        <Typography variant="overline" fontWeight="bold" color="text.secondary" mb="6px">
          Your current ranking
        </Typography>
        <Typography variant="h3" fontWeight="bold" display="flex" alignItems="center" gap={1}>
          <SvgIcon component={StarIcon} inheritViewBox />#{mockRanking}
        </Typography>
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
          activationDate="September 10"
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

        <div className={css.diamondImage}>
          <Image src={Diamond} alt="Diamond image" width={200} height={200} />
        </div>

        <Typography variant="h1" fontWeight={700} textAlign="center" mt={-3} mb={1} className={css.gradientText}>
          Lottery
        </Typography>
        <Typography textAlign="center" px="100px">
          250k SAFE - 50k SAFE to be given to 5 Safe Miles participants
        </Typography>
      </div>

      <Divider />

      <Link href="#" sx={{ textAlign: 'center' }}>
        More info about Activity Miles
      </Link>
    </>
  )
}
