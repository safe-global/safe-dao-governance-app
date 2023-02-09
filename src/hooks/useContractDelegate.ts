import { useEffect } from 'react'
import useSWR from 'swr'
import { formatBytes32String, hexZeroPad } from 'ethers/lib/utils'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { CHAIN_DELEGATE_ID, DELEGATE_REGISTRY_ADDRESS, ZERO_ADDRESS } from '@/config/constants'
import { useWeb3 } from '@/hooks/useWeb3'
import { getDelegateRegistryContract, getDelegateRegistryInterface } from '@/services/contracts/DelegateRegistry'
import { useWallet } from '@/hooks/useWallet'
import type { FileDelegate } from '@/hooks/useDelegatesFile'
import type { EventFilter } from '@ethersproject/abstract-provider'

export type ContractDelegate = Pick<FileDelegate, 'address' | 'ens'>

export const _getContractDelegate = async (web3?: JsonRpcProvider): Promise<ContractDelegate | null> => {
  if (!web3) {
    return null
  }

  const signer = web3.getSigner()

  const chainId = await signer.getChainId()

  const delegateId = CHAIN_DELEGATE_ID[chainId]

  if (!delegateId) {
    return null
  }

  const address = await signer.getAddress()

  const delegateRegistryContract = getDelegateRegistryContract(signer)

  const delegate = await delegateRegistryContract.delegation(address, formatBytes32String(delegateId))

  if (delegate === ZERO_ADDRESS) {
    return null
  }

  const ens = await web3.lookupAddress(delegate)

  return {
    ens,
    address: delegate,
  }
}

export const useContractDelegate = () => {
  const QUERY_KEY = 'contract-delegate'

  const web3 = useWeb3()
  const wallet = useWallet()

  return useSWR(web3 ? [QUERY_KEY, wallet?.address, wallet?.chainId] : null, () => _getContractDelegate(web3))
}

const delegateRegistryInterface = getDelegateRegistryInterface()
const setDelegateEvent = delegateRegistryInterface.getEventTopic(
  delegateRegistryInterface.events['SetDelegate(address,bytes32,address)'],
)

export const useContractDelegateInvalidator = () => {
  const web3 = useWeb3()
  const { mutate } = useContractDelegate()

  useEffect(() => {
    if (!web3) {
      return
    }

    let filter: EventFilter
    ;(async () => {
      const signer = web3.getSigner()

      const address = await signer.getAddress()
      const chainId = await signer.getChainId()

      const delegateId = CHAIN_DELEGATE_ID[chainId]

      if (!delegateId) {
        return null
      }

      filter = {
        address: DELEGATE_REGISTRY_ADDRESS,
        // Each topic has to be 32 bytes
        topics: [setDelegateEvent, hexZeroPad(address, 32), formatBytes32String(delegateId)],
      }

      // Invalidate cache
      web3.on(filter, mutate)
    })()

    return () => {
      web3.off(filter)
    }
  }, [web3, mutate])
}
