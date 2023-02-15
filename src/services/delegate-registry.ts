import { formatBytes32String } from 'ethers/lib/utils'
import type { ContractTransaction } from '@ethersproject/contracts'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { CHAIN_DELEGATE_ID } from '@/config/constants'
import { chainIdStore } from '@/hooks/useChainId'
import { getDelegateRegistryContract } from '@/services/contracts/DelegateRegistry'

export const setDelegate = async (
  provider: JsonRpcProvider,
  delegateAddress: string,
): Promise<ContractTransaction | undefined> => {
  const signer = provider.getSigner()

  let signerChainId: number | undefined

  try {
    signerChainId = await signer.getChainId()
  } catch (err) {
    console.error('Error getting chainId', err)
  }

  const chainId = chainIdStore.getStore()

  if (!signerChainId || !chainId || signerChainId !== chainId) {
    console.error('Invalid chainId', signerChainId)
    return
  }

  const delegateId = CHAIN_DELEGATE_ID[signerChainId]

  if (!delegateId) {
    console.error('No delegateId found for chainId', signerChainId)
    return
  }

  const delegateRegistryContract = getDelegateRegistryContract(signer)

  let tx: ContractTransaction | undefined

  try {
    tx = await delegateRegistryContract.setDelegate(formatBytes32String(delegateId), delegateAddress)
  } catch (err) {
    console.error('Error setting delegate', err)
  }

  return tx
}
