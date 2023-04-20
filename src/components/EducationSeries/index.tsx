import { lazy } from 'react'
import type { ReactElement } from 'react'

import { createStepper } from '@/services/StepperFactory'

const steps = [
  lazy(() => import('@/components/EducationSeries/steps/SafeInfo')),
  lazy(() => import('@/components/EducationSeries/steps/Distribution')),
  lazy(() => import('@/components/EducationSeries/steps/SafeToken')),
  lazy(() => import('@/components/EducationSeries/steps/SafeDao')),
  lazy(() => import('@/components/EducationSeries/steps/Disclaimer')),
]

const EducationSeriesContext = createStepper()

export const useEducationSeriesStepper = EducationSeriesContext.useStepper

export const EducationSeries = (): ReactElement => {
  return <EducationSeriesContext.Provider steps={steps} />
}
