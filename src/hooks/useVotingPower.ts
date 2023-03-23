import { BigNumber } from 'ethers'
import useSWR from 'swr'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { CHAIN_SAFE_TOKEN_ADDRESS, POLLING_INTERVAL } from '@/config/constants'
import { getSafeTokenInterface } from '@/services/contracts/SafeToken'
import { useVestingData, Vesting } from './useVestingData'
import { isDashboard } from '@/utils/routes'
import { useRouter } from 'next/router'
import { useAddress } from '@/hooks/useAddress'
import { useChainId } from '@/hooks/useChainId'
import { useWeb3 } from '@/hooks/useWeb3'

const tokenInterface = getSafeTokenInterface()

const fetchTokenBalance = async (chainId: number, safeAddress: string, provider: JsonRpcProvider): Promise<string> => {
  const safeTokenAddress = CHAIN_SAFE_TOKEN_ADDRESS[chainId]

  if (!safeTokenAddress) {
    return '0'
  }

  try {
    return await provider.call({
      to: safeTokenAddress,
      data: tokenInterface.encodeFunctionData('balanceOf', [safeAddress]),
    })
  } catch (err) {
    throw Error(`Error fetching Safe token balance:  ${err}`)
  }
}

const computeVotingPower = (validVestingData: Vesting[], balance: string) => {
  const tokensInVesting = validVestingData.reduce(
    (acc, data) => acc.add(data.amount).sub(data.amountClaimed),
    BigNumber.from(0),
  )

  // add balance
  return tokensInVesting.add(balance || '0')
}

export const _getVotingPower = async ({
  chainId,
  address,
  web3,
  vestingData,
}: {
  chainId: number
  address?: string
  web3?: JsonRpcProvider
  vestingData: Vesting[]
}): Promise<BigNumber | null> => {
  if (!address || !web3) {
    return null
  }

  const balance = await fetchTokenBalance(chainId, address, web3)

  return computeVotingPower(vestingData, balance)
}

export const useVotingPower = () => {
  const QUERY_KEY = 'voting-power'

  const { pathname } = useRouter()
  const web3 = useWeb3()
  const chainId = useChainId()
  const address = useAddress()

  const { data: vestingData } = useVestingData()

  /**
   * TODO: Get balance via `safe-apps-sdk` when method is no longer
   * experimental to avoid `eth_getBalance`when using as Safe App:
   * @see https://github.com/safe-global/safe-apps-sdk/tree/main/packages/safe-apps-sdk#getting-safe-balances
   */
  return useSWR(
    web3 ? [QUERY_KEY, address, chainId] : null,
    () => _getVotingPower({ chainId, address, web3, vestingData: vestingData || [] }),
    {
      refreshInterval: !isDashboard(pathname) ? POLLING_INTERVAL : undefined,
    },
  )
}
