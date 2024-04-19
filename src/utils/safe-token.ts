import { CHAIN_SAFE_LOCKING_ADDRESS, CHAIN_SAFE_TOKEN_ADDRESS } from '@/config/constants'
import { getSafeTokenInterface } from '@/services/contracts/SafeToken'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

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

export const fetchTokenLockingAllowance = async (
  chainId: string,
  safeAddress: string,
  provider: JsonRpcProvider,
): Promise<string> => {
  const safeTokenAddress = CHAIN_SAFE_TOKEN_ADDRESS[chainId]
  const safeLockingAddress = CHAIN_SAFE_LOCKING_ADDRESS[chainId]

  if (!safeTokenAddress) {
    return '0'
  }

  try {
    return await provider.call({
      to: safeTokenAddress,
      data: tokenInterface.encodeFunctionData('allowance', [safeAddress, safeLockingAddress]),
    })
  } catch (err) {
    throw Error(`Error fetching Safe Token balance:  ${err}`)
  }
}

export const createApproveTx = (chainId: string, amount: BigNumber) => {
  const safeTokenAddress = CHAIN_SAFE_TOKEN_ADDRESS[chainId]
  const safeLockingAddress = CHAIN_SAFE_LOCKING_ADDRESS[chainId]
  return {
    to: safeTokenAddress,
    value: '0',
    data: tokenInterface.encodeFunctionData('approve', [safeLockingAddress, amount]),
  }
}
