import { CHAIN_SAFE_TOKEN_ADDRESS } from '@/config/constants'
import { getSafeTokenInterface } from '@/services/contracts/SafeToken'
import type { JsonRpcProvider } from '@ethersproject/providers'

const tokenInterface = getSafeTokenInterface()

export const fetchTokenBalance = async (
  chainId: string,
  safeAddress: string,
  provider: JsonRpcProvider,
): Promise<string> => {
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
    throw Error(`Error fetching Safe Token balance:  ${err}`)
  }
}
