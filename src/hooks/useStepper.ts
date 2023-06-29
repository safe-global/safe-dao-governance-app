import { useCallback, useState } from 'react'

export const useStepper = <T extends unknown>(initialData: T) => {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<T>(initialData)

  const nextStep = useCallback((entireData: T) => {
    setData(entireData)
    setStep((prevStep) => prevStep + 1)
  }, [])

  const prevStep = useCallback(() => {
    setStep((prevStep) => prevStep - 1)
  }, [])

  return { step, data, setData, nextStep, prevStep }
}
