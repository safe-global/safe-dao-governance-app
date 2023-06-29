import { useRouter } from 'next/router'
import type { ReactElement } from 'react'

import { useDelegatesFile } from '@/hooks/useDelegatesFile'
import { useDelegate } from '@/hooks/useDelegate'
import SelectDelegate from '@/components/Delegation/steps/SelectDelegate'
import ReviewDelegate from '@/components/Delegation/steps/ReviewDelegate'
import SuccessfulDelegation from '@/components/Delegation/steps/SuccessfulDelegation'
import { useStepper } from '@/hooks/useStepper'
import { FileDelegate } from '@/hooks/useDelegatesFile'
import { ProgressBar } from '@/components/ProgressBar'
import { AppRoutes } from '@/config/routes'
import type { Delegate } from '@/hooks/useDelegate'
import type { ContractDelegate } from '@/hooks/useContractDelegate'

export type DelegateFlow = {
  safeGuardian?: FileDelegate
  customDelegate?: ContractDelegate
  selectedDelegate?: Delegate
}

export const Delegation = (): ReactElement => {
  const router = useRouter()

  const delegate = useDelegate() ?? undefined
  const { data: delegateFiles } = useDelegatesFile()

  const safeGuardian = delegateFiles?.find(({ address }) => address === delegate?.address)

  const { step, data, setData, prevStep, nextStep } = useStepper<DelegateFlow>({
    safeGuardian,
    customDelegate: safeGuardian ? undefined : delegate,
    selectedDelegate: delegate,
  })

  const steps = [
    <SelectDelegate key={0} data={data} setData={setData} onNext={(data: DelegateFlow) => nextStep(data)} />,
    <ReviewDelegate key={1} data={data} onBack={prevStep} onNext={() => nextStep(data)} />,
    <SuccessfulDelegation key={4} onNext={() => router.push(AppRoutes.index)} />,
  ]

  const progress = ((step + 1) / steps.length) * 100

  return (
    <>
      <ProgressBar value={progress} />
      {steps[step]}
    </>
  )
}
