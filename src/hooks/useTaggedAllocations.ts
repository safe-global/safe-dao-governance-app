import { BigNumber } from 'ethers'

import { useAmounts } from '@/hooks/useAmounts'
import { getVestingTypes } from '@/utils/vesting'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'

const getTotal = (...amounts: string[]) => {
  const [amount, ...rest] = amounts
  const total = rest.reduce((acc, amount) => {
    return acc.add(BigNumber.from(amount))
  }, BigNumber.from(amount))

  return total.toString()
}

export const useTaggedAllocations = (
  isEligibleForBoostedSAP?: boolean,
): {
  sep5: {
    claimable: string
    inVesting: string
  }
  user: {
    claimable: string
    inVesting: string
  }
  ecosystem: {
    claimable: string
    inVesting: string
  }
  investor: {
    claimable: string
    inVesting: string
  }
  sapBoosted: {
    claimable: string
    inVesting: string
    allocation: string
  }
  sapUnboosted: {
    claimable: string
    inVesting: string
    allocation: string
  }
  total: {
    claimable: string
    inVesting: string
    allocation: string
  }
  totalSAP: {
    claimable: string
    inVesting: string
    allocation: string
  }
} => {
  const { data: allocation } = useSafeTokenAllocation()

  // Get vesting types
  const { userVesting, sep5Vesting, ecosystemVesting, investorVesting, sapBoostedVesting, sapUnboostedVesting } =
    getVestingTypes(allocation?.vestingData || [])

  // Calculate claimable vs. vested amounts for each vesting type
  const [sep5Claimable, sep5InVesting] = useAmounts(sep5Vesting)
  const [userClaimable, userInVesting] = useAmounts(userVesting)
  const [ecosystemClaimable, ecosystemInVesting] = useAmounts(ecosystemVesting)
  const [investorClaimable, investorInVesting] = useAmounts(investorVesting)
  const [sapBoostedClaimable, sapBoostedInVesting] = useAmounts(sapBoostedVesting)
  const [sapUnboostedClaimable, sapUnboostedInVesting] = useAmounts(sapUnboostedVesting)

  // Calculate total of claimable vs. vested amounts
  const totalAmountClaimable = getTotal(sep5Claimable, userClaimable, ecosystemClaimable, investorClaimable)

  const totalAmountInVesting = getTotal(sep5InVesting, userInVesting, ecosystemInVesting, investorInVesting)

  const totalAllocation = getTotal(
    sep5Vesting?.amount || '0',
    userVesting?.amount || '0',
    ecosystemVesting?.amount || '0',
    investorVesting?.amount || '0',
  )

  const totalSAPClaimable = getTotal(isEligibleForBoostedSAP ? sapBoostedClaimable : '0', sapUnboostedClaimable)
  const totalSAPInVesting = getTotal(isEligibleForBoostedSAP ? sapBoostedInVesting : '0', sapUnboostedInVesting)
  const totalSAP = getTotal(
    isEligibleForBoostedSAP ? sapBoostedVesting?.amount || '0' : '0',
    sapUnboostedVesting?.amount || '0',
  )
  const totalSAPBoosted = sapBoostedVesting?.amount || '0'
  const totalSAPUnboosted = sapUnboostedVesting?.amount || '0'

  return {
    sep5: {
      claimable: sep5Claimable,
      inVesting: sep5InVesting,
    },
    user: {
      claimable: userClaimable,
      inVesting: userInVesting,
    },
    ecosystem: {
      claimable: ecosystemClaimable,
      inVesting: ecosystemInVesting,
    },
    investor: {
      claimable: investorClaimable,
      inVesting: investorInVesting,
    },
    sapBoosted: {
      claimable: sapBoostedClaimable,
      inVesting: sapBoostedInVesting,
      allocation: totalSAPBoosted,
    },
    sapUnboosted: {
      claimable: sapUnboostedClaimable,
      inVesting: sapUnboostedInVesting,
      allocation: totalSAPUnboosted,
    },
    total: {
      claimable: totalAmountClaimable,
      inVesting: totalAmountInVesting,
      allocation: totalAllocation,
    },
    totalSAP: {
      claimable: totalSAPClaimable,
      inVesting: totalSAPInVesting,
      allocation: totalSAP,
    },
  }
}
