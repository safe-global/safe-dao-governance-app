import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatBytes32String, hexZeroPad } from 'ethers/lib/utils'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { CHAIN_DELEGATE_ID, DELEGATE_REGISTRY_ADDRESS, ZERO_ADDRESS } from '@/config/constants'
import { useWeb3 } from '@/hooks/useWeb3'
import { getDelegateRegistryContract, getDelegateRegistryInterface } from '@/services/contracts/DelegateRegistry'
import { useWallet } from '@/hooks/useWallet'
import { getQueryClient } from '@/services/QueryClient'
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

const CONTRACT_DELEGATE_QUERY_KEY = 'contractDelegate'

export const useContractDelegate = () => {
  const web3 = useWeb3()
  const wallet = useWallet()

  return useQuery({
    queryKey: [CONTRACT_DELEGATE_QUERY_KEY, wallet?.address, wallet?.chainId],
    queryFn: () => _getContractDelegate(web3),
    enabled: !!web3,
  })
}

const delegateRegistryInterface = getDelegateRegistryInterface()
const setDelegateEvent = delegateRegistryInterface.getEventTopic(
  delegateRegistryInterface.events['SetDelegate(address,bytes32,address)'],
)

const queryClient = getQueryClient()

export const useContractDelegateInvalidator = () => {
  const web3 = useWeb3()

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

      web3.on(filter, () => queryClient.invalidateQueries({ queryKey: [CONTRACT_DELEGATE_QUERY_KEY] }))
    })()

    return () => {
      web3.off(filter)
    }
  }, [web3])
}
