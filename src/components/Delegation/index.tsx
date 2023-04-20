import { lazy } from 'react'
import type { ReactElement } from 'react'

import { createStepper } from '@/services/StepperFactory'
import { useDelegatesFile } from '@/hooks/useDelegatesFile'
import { useDelegate } from '@/hooks/useDelegate'
import type { FileDelegate } from '@/hooks/useDelegatesFile'
import type { Delegate } from '@/hooks/useDelegate'
import type { ContractDelegate } from '@/hooks/useContractDelegate'

const steps = [
  lazy(() => import('@/components/Delegation/steps/SelectDelegate')),
  lazy(() => import('@/components/Delegation/steps/ReviewDelegate')),
  lazy(() => import('@/components/Delegation/steps/SuccessfulDelegation')),
]

type DelegationStepperState = {
  safeGuardian?: FileDelegate
  customDelegate?: ContractDelegate
  selectedDelegate?: Delegate
}

const DelegationContext = createStepper<DelegationStepperState>()

export const useDelegationStepper = DelegationContext.useStepper

export const Delegation = (): ReactElement => {
  const delegate = useDelegate() ?? undefined
  const { data: delegateFiles } = useDelegatesFile()

  const safeGuardian = delegateFiles?.find(({ address }) => address === delegate?.address)

  const initialState: DelegationStepperState = {
    selectedDelegate: delegate,
    customDelegate: safeGuardian ? undefined : delegate,
    safeGuardian,
  }

  return <DelegationContext.Provider steps={steps} initialState={initialState} />
}
