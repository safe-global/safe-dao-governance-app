import { Grid, Typography } from '@mui/material'
import { useState } from 'react'
import type { Dispatch, ReactElement, SetStateAction } from 'react'

import { DelegateList } from '@/components/DelegateList'
import { DelegateSwitch } from '@/components/DelegateSwitch'
import { CustomDelegate } from '@/components/CustomDelegate'
import { StepHeader } from '@/components/StepHeader'
import { useDelegatesFile } from '@/hooks/useDelegatesFile'
import type { DelegateFlow } from '@/components/Delegation'
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

const SelectDelegate = (props: {
  data: DelegateFlow
  setData: Dispatch<SetStateAction<DelegateFlow>>
  onNext: (data: DelegateFlow) => void
}): ReactElement => {
  const { data: delegateFiles } = useDelegatesFile()

  const [delegateType, setDelegateType] = useState<DelegateType | undefined>(
    getDelegateType(delegateFiles, props.data.selectedDelegate?.address),
  )

  return (
    <Grid container p={6} gap={3}>
      <Grid item xs={12}>
        <StepHeader title="Choose a delegate" />
      </Grid>

      <Grid item xs={12} container alignItems="flex-end" justifyContent="space-between" gap={2}>
        <Typography>
          A delegate is someone you select to make governance decisions on your behalf. You still retain full ownership
          of your Safe Tokens, but your delegate will wield the voting power associated with those Tokens, including
          your unvested allocation.
        </Typography>

        <DelegateSwitch delegateType={delegateType} setDelegateType={setDelegateType} />

        {delegateType === DelegateType.SAFE_GUARDIAN ? <DelegateList {...props} /> : <CustomDelegate {...props} />}
      </Grid>
    </Grid>
  )
}

export default SelectDelegate
