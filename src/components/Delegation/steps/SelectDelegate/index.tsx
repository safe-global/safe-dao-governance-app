import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'

import { DelegateList } from '@/components/DelegateList'
import { DelegateSwitch } from '@/components/DelegateSwitch'
import { CustomDelegate } from '@/components/CustomDelegate'
import { StepHeader } from '@/components/StepHeader'
import { useDelegationStepper } from '@/components/Delegation'
import { useDelegate } from '@/hooks/useDelegate'
import { useDelegatesFile } from '@/hooks/useDelegatesFile'
import type { FileDelegate } from '@/hooks/useDelegatesFile'

export const enum DelegateType {
  CUSTOM = 'CUSTOM',
  SAFE_GUARDIAN = 'SAFE_GUARDIAN',
}

const getDelegateType = (delegateFiles?: FileDelegate[], address?: string) => {
  if (!delegateFiles || !address) {
    return undefined
  }

  return delegateFiles.some((delegate) => delegate.address === address)
    ? DelegateType.SAFE_GUARDIAN
    : DelegateType.CUSTOM
}

const SelectDelegate = (): ReactElement => {
  const { stepperState, setStepperState } = useDelegationStepper()
  const delegate = useDelegate()
  const { data: delegateFiles } = useDelegatesFile()

  const [delegateType, setDelegateType] = useState<DelegateType | undefined>(
    getDelegateType(delegateFiles, stepperState?.selectedDelegate?.address),
  )

  // Initialize stepper state with contract delegate if it exists
  useEffect(() => {
    if (!delegate || stepperState?.customDelegate || stepperState?.safeGuardian) {
      return
    }

    const safeGuardian = delegateFiles?.find(({ address }) => address === delegate?.address)

    setStepperState((prev) => ({
      ...prev,
      selectedDelegate: delegate,
      customDelegate: safeGuardian ? undefined : delegate,
      safeGuardian,
    }))

    setDelegateType(getDelegateType(delegateFiles, delegate?.address))
  }, [delegate, delegateFiles, setStepperState, stepperState])

  return (
    <Grid container p={6} gap={3}>
      <Grid item xs={12}>
        <StepHeader title="Choose a delegate" />
      </Grid>

      <Grid item xs={12} container alignItems="flex-end" justifyContent="space-between" gap={2}>
        <Typography>
          A delegate is someone you select to make governance decisions on your behalf. You still retain full ownership
          of your tokens, but your delegate will wield the voting power associated with those tokens, including your
          unvested allocation.
        </Typography>

        <DelegateSwitch delegateType={delegateType} setDelegateType={setDelegateType} />

        {delegateType && (delegateType === DelegateType.SAFE_GUARDIAN ? <DelegateList /> : <CustomDelegate />)}
      </Grid>
    </Grid>
  )
}

export default SelectDelegate
