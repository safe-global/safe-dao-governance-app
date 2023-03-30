import { formatBytes32String } from 'ethers/lib/utils'
import type { ContractTransaction } from '@ethersproject/contracts'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { CHAIN_DELEGATE_ID } from '@/config/constants'
import { getDelegateRegistryContract } from '@/services/contracts/DelegateRegistry'

export const setDelegate = async (
  chainId: string,
  web3: JsonRpcProvider,
  delegateAddress: string,
): Promise<ContractTransaction | undefined> => {
  const delegateId = CHAIN_DELEGATE_ID[chainId]

  if (!delegateId) {
    console.error('No delegateId found for chainId', chainId)
    return
  }

  const delegateRegistryContract = getDelegateRegistryContract(web3)

  let tx: ContractTransaction | undefined

  try {
    tx = await delegateRegistryContract.setDelegate(formatBytes32String(delegateId), delegateAddress)
  } catch (err) {
    console.error('Error setting delegate', err)
  }

  return tx
}
