import { useRouter } from 'next/router'
import type { ReactElement } from 'react'

import { useStepper } from '@/hooks/useStepper'
import ClaimOverview from '@/components/Claim/steps/ClaimOverview'
import SuccessfulClaim from '@/components/Claim/steps/SuccessfulClaim'
import { AppRoutes } from '@/config/routes'
import { ProgressBar } from '@/components/ProgressBar'

export type ClaimFlow = {
  claimedAmount: string
}

export const Claim = (): ReactElement => {
  const router = useRouter()

  const { step, data, nextStep } = useStepper<ClaimFlow>({
    claimedAmount: '',
  })

  const steps = [
    <ClaimOverview key={0} onNext={(data: ClaimFlow) => nextStep(data)} />,
    <SuccessfulClaim key={1} data={data} onNext={() => router.push(AppRoutes.index)} />,
  ]

  const progress = ((step + 1) / steps.length) * 100

  return (
    <>
      <ProgressBar value={progress} />
      {steps[step]}
    </>
  )
}
