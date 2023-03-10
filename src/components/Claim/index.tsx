import { lazy } from 'react'

import { createStepper } from '@/services/StepperFactory'

const steps = [
  lazy(() => import('@/components/Claim/steps/ClaimOverview')),
  lazy(() => import('@/components/Claim/steps/SuccessfulClaim')),
]

const ClaimContext = createStepper({
  steps,
  state: { claimedAmount: '' },
})

export const useClaimStepper = ClaimContext.useStepper

export const Claim = ClaimContext.Stepper
