import useSWR from 'swr'
import { formatBytes32String } from 'ethers/lib/utils'
import { useRouter } from 'next/router'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { CHAIN_DELEGATE_ID, POLLING_INTERVAL, ZERO_ADDRESS } from '@/config/constants'
import { useWeb3 } from '@/hooks/useWeb3'
import { getDelegateRegistryContract } from '@/services/contracts/DelegateRegistry'
import { useAddress } from '@/hooks/useAddress'
import { useChainId } from '@/hooks/useChainId'
import { isDashboard } from '@/utils/routes'
import type { FileDelegate } from '@/hooks/useDelegatesFile'

export type ContractDelegate = Pick<FileDelegate, 'address' | 'ens'>

export const _getContractDelegate = async (
  chainId: string,
  address?: string,
  web3?: JsonRpcProvider,
): Promise<ContractDelegate | null> => {
  if (!address || !web3) {
    return null
  }

  const delegateId = CHAIN_DELEGATE_ID[chainId]

  if (!delegateId) {
    return null
  }

  const delegateRegistryContract = getDelegateRegistryContract(web3)

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

  const { pathname } = useRouter()
  const web3 = useWeb3()
  const chainId = useChainId()
  const address = useAddress()

  return useSWR(web3 ? [QUERY_KEY, chainId, address] : null, () => _getContractDelegate(chainId, address, web3), {
    refreshInterval: isDashboard(pathname) ? undefined : POLLING_INTERVAL,
  })
}
