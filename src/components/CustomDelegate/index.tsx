import { CircularProgress, InputAdornment, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useState, useMemo } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { isAddress } from 'ethers/lib/utils'
import type { ReactElement, ChangeEvent } from 'react'

import { useEnsResolution } from '@/hooks/useEnsResolution'
import { InfoAlert } from '@/components/InfoAlert'
import { NavButtons } from '@/components/NavButtons'
import { useDelegationStepper } from '@/components/Delegation'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import { useDelegate } from '@/hooks/useDelegate'
import type { Delegate } from '@/hooks/useDelegate'

export const CustomDelegate = (): ReactElement => {
  const isSafeApp = useIsSafeApp()
  const delegate = useDelegate()
  const { onNext, setStepperState, stepperState } = useDelegationStepper()

  const [search, setSearch] = useState(stepperState?.customDelegate?.ens || stepperState?.customDelegate?.address || '')

  const [ensAddress, ensError, ensLoading] = useEnsResolution(search)
  const isValidEnsAddress = ensAddress && isAddress(ensAddress)

  const customDelegate = useMemo<Delegate | undefined>(() => {
    if (!isValidEnsAddress) {
      return
    }

    const newCustomDelegate = {
      ens: isAddress(search) ? null : search || null,
      address: ensAddress,
    }

    setStepperState((prev) => ({
      ...prev,
      customDelegate: newCustomDelegate,
    }))

    return newCustomDelegate
  }, [ensAddress, isValidEnsAddress, search, setStepperState])

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value)
  }

  const onSubmit = () => {
    setStepperState((prev) => ({
      ...prev,
      selectedDelegate: customDelegate,
    }))

    onNext()
  }

  const isCurrentDelegate = customDelegate && customDelegate?.address === delegate?.address

  return (
    <>
      <Typography>
        The wallet address can belong to any person but you cannot delegate to{' '}
        {isSafeApp ? 'your own Safe Account' : 'yourself'}.
      </Typography>

      <TextField
        fullWidth
        onChange={onSearch}
        variant="outlined"
        value={search}
        placeholder="Search address or ENS"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ fill: (theme) => theme.palette.primary.light }} />
            </InputAdornment>
          ),
          endAdornment: ensLoading ? (
            <InputAdornment position="end">
              <CircularProgress />
            </InputAdornment>
          ) : ensAddress ? (
            <InputAdornment position="end">
              <CheckCircleRoundedIcon color="primary" />
            </InputAdornment>
          ) : undefined,
        }}
        error={!!ensError || isCurrentDelegate}
        helperText={
          isCurrentDelegate
            ? 'Given delegate is already delegated'
            : isValidEnsAddress && ensAddress !== search
            ? ensAddress
            : ensError
        }
      />

      {isSafeApp && (
        <InfoAlert>
          <Typography variant="subtitle1">
            For gasless voting, we suggest selecting an EOA wallet e.g. your connected wallet.
          </Typography>
        </InfoAlert>
      )}

      <NavButtons onNext={onSubmit} isNextDisabled={!ensAddress || !!ensError || ensLoading || isCurrentDelegate} />
    </>
  )
}
