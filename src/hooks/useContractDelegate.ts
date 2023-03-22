import useSWR from 'swr'
import { formatBytes32String } from 'ethers/lib/utils'
import { useRouter } from 'next/router'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { CHAIN_DELEGATE_ID, POLLING_INTERVAL, ZERO_ADDRESS } from '@/config/constants'
import { useWeb3 } from '@/hooks/useWeb3'
import { getDelegateRegistryContract } from '@/services/contracts/DelegateRegistry'
import { useWallet } from '@/hooks/useWallet'
import { isDashboard } from '@/utils/routes'
import type { FileDelegate } from '@/hooks/useDelegatesFile'

export type ContractDelegate = Pick<FileDelegate, 'address' | 'ens'>

export const _getContractDelegate = async (web3?: JsonRpcProvider): Promise<ContractDelegate | null> => {
  if (!web3) {
    return null
  }

  const signer = web3.getSigner()

  const signerChainId = await signer.getChainId()

  const delegateId = CHAIN_DELEGATE_ID[signerChainId]

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

  const { pathname } = useRouter()
  const web3 = useWeb3()
  const wallet = useWallet()

  return useSWR(web3 ? [QUERY_KEY, wallet?.address, wallet?.chainId] : null, () => _getContractDelegate(web3), {
    refreshInterval: !isDashboard(pathname) ? POLLING_INTERVAL : undefined,
  })
}
