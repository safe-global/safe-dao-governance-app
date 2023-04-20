import { lazy } from 'react'
import type { ReactElement } from 'react'

import { createStepper } from '@/services/StepperFactory'

const steps = [
  lazy(() => import('@/components/Claim/steps/ClaimOverview')),
  lazy(() => import('@/components/Claim/steps/SuccessfulClaim')),
]

type ClaimStepperState = {
  claimedAmount: string
}

const ClaimContext = createStepper<ClaimStepperState>()

export const useClaimStepper = ClaimContext.useStepper

export const Claim = (): ReactElement => {
  const initialState: ClaimStepperState = {
    claimedAmount: '',
  }

  return <ClaimContext.Provider steps={steps} initialState={initialState} />
}
