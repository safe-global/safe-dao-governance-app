import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'

import { AIRDROP_TAGS } from '@/config/constants'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'

const MAX_UINT128 = BigNumber.from('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')

/**
 * Splits the amount the user wants to claim into user airdrop, SEP5 airdrop and ecosystem airdrop.
 * @returns sep5Amount in Wei, userAmount in Wei, investorAmount in Wei, ecosystemAmount in Wei
 */
export const splitAirdropAmounts = ({
  isMax,
  amount: claim,
  sep5AirdropClaimable,
  userAirdropClaimable,
  investorClaimable,
}: {
  isMax: boolean
  amount: string
  sep5AirdropClaimable: string
  userAirdropClaimable: string
  investorClaimable: string
}): [
  string, // SEP5
  string, // User
  string, // Investor
  string, // Ecosystem
] => {
  if (isMax) {
    return [MAX_UINT128.toString(), MAX_UINT128.toString(), MAX_UINT128.toString(), MAX_UINT128.toString()]
  }

  const amountInWei = parseEther(claim)

  const sep5 = BigNumber.from(sep5AirdropClaimable)

  // We must claim from SEP5 first in case the selected amount is below that of the pre-SEP5 allocation
  if (amountInWei.lte(sep5)) {
    return [amountInWei.toString(), '0', '0', '0']
  }

  const user = BigNumber.from(userAirdropClaimable)
  const userAndSep5 = sep5.add(user)

  if (amountInWei.lte(userAndSep5)) {
    const leftOver = amountInWei.sub(sep5)
    return [sep5AirdropClaimable, leftOver.toString(), '0', '0']
  }

  const investor = BigNumber.from(investorClaimable)
  const userAndSep5AndInvestor = userAndSep5.add(investor)

  if (amountInWei.lte(userAndSep5AndInvestor)) {
    const leftOver = amountInWei.sub(userAndSep5)
    return [sep5AirdropClaimable, userAirdropClaimable, leftOver.toString(), '0']
  }

  return [
    sep5AirdropClaimable,
    userAirdropClaimable,
    investorClaimable,
    amountInWei.sub(userAndSep5AndInvestor).toString(),
  ]
}

export const canRedeemSep5Airdrop = (allocation: ReturnType<typeof useSafeTokenAllocation>['data']): boolean => {
  const sep5Allocation = allocation?.vestingData.find(({ tag }) => tag === AIRDROP_TAGS.SEP5)

  if (!sep5Allocation) {
    return false
  }

  return !sep5Allocation.isRedeemed && !sep5Allocation.isExpired
}
