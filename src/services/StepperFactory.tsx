/* eslint-disable @typescript-eslint/no-empty-function */

import { useRouter } from 'next/router'
import { createContext, Suspense, useContext, useState } from 'react'
import type { JSXElementConstructor, LazyExoticComponent, ReactElement, Dispatch, SetStateAction } from 'react'

import { AppRoutes } from '@/config/routes'
import { ProgressBar } from '@/components/ProgressBar'

export const createStepper = <T extends Record<string, unknown>>() => {
  type StepperState = T | undefined

  // Typed context
  const Context = createContext<{
    stepperState: StepperState
    setStepperState: Dispatch<SetStateAction<StepperState>>
    onBack: () => void
    onNext: () => void
  }>({
    stepperState: undefined,
    setStepperState: () => {},
    onBack: () => {},
    onNext: () => {},
  })

  // Typed Provider
  const Provider = ({
    initialState,
    steps,
    children,
  }: {
    initialState?: T
    steps: LazyExoticComponent<() => ReactElement<any, string | JSXElementConstructor<any>>>[]
    children?: (Step: LazyExoticComponent<() => ReactElement<any, string | JSXElementConstructor<any>>>) => ReactElement
  }): ReactElement => {
    const router = useRouter()

    const [stepperState, setStepperState] = useState<StepperState>(initialState)
    const [activeStep, setActiveStep] = useState(0)

    const onBack = () => {
      if (activeStep > 0) {
        setActiveStep(activeStep - 1)
      }
    }

    const onNext = () => {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1)
      } else {
        router.push(AppRoutes.index)
      }
    }

    const progress = ((activeStep + 1) / steps.length) * 100

    const Step = steps[activeStep]

    return (
      <Context.Provider
        value={{
          stepperState,
          setStepperState,
          onBack,
          onNext,
        }}
      >
        <ProgressBar value={progress} />
        <Suspense>{children ? children(Step) : <Step />}</Suspense>
      </Context.Provider>
    )
  }

  const useStepper = () => {
    const stepperContext = useContext(Context)

    if (!stepperContext) {
      throw new Error('useStepper must be used within a Stepper Provider')
    }

    return stepperContext
  }

  return {
    Provider,
    useStepper,
  }
}
