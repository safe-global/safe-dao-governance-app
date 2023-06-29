import type { ReactElement } from 'react'

import { useRouter } from 'next/router'
import { useStepper } from '@/hooks/useStepper'
import SafeInfo from '@/components/EducationSeries/steps/SafeInfo'
import Distribution from '@/components/EducationSeries/steps/Distribution'
import SafeToken from '@/components/EducationSeries/steps/SafeToken'
import SafeDao from '@/components/EducationSeries/steps/SafeDao'
import Disclaimer from '@/components/EducationSeries/steps/Disclaimer'
import { AppRoutes } from '@/config/routes'
import { ProgressBar } from '@/components/ProgressBar'

export const EducationSeries = (): ReactElement => {
  const router = useRouter()

  const { step, prevStep, nextStep } = useStepper(undefined)

  const onNext = () => {
    nextStep(undefined)
  }

  const steps = [
    <SafeInfo key={0} onNext={onNext} />,
    <Distribution key={1} onBack={prevStep} onNext={onNext} />,
    <SafeToken key={2} onBack={prevStep} onNext={onNext} />,
    <SafeDao key={3} onBack={prevStep} onNext={onNext} />,
    <Disclaimer key={4} onBack={prevStep} onNext={() => router.push(AppRoutes.index)} />,
  ]

  const progress = ((step + 1) / steps.length) * 100

  return (
    <>
      <ProgressBar value={progress} />
      {steps[step]}
    </>
  )
}
