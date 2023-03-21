import { useEffect } from 'react'
import { formatBytes32String } from 'ethers/lib/utils'

import { CHAIN_DELEGATE_ID, POLLING_INTERVAL } from '@/config/constants'
import { useWeb3 } from '@/hooks/useWeb3'
import { getDelegateRegistryContract } from '@/services/contracts/DelegateRegistry'
import { useContractDelegate } from '@/hooks/useContractDelegate'

export const useContractDelegateInvalidator = () => {
  const web3 = useWeb3()
  const { mutate } = useContractDelegate()

  useEffect(() => {
    if (!web3) {
      return
    }

    let timeoutId: NodeJS.Timeout
    ;(async () => {
      const signer = web3.getSigner()

      const signerChainId = await signer.getChainId()

      const delegateId = CHAIN_DELEGATE_ID[signerChainId]

      if (!delegateId) {
        return
      }

      const signerAddress = await signer.getAddress()

      const delegateRegistryContract = getDelegateRegistryContract(signer)

      // setDelegate event
      const filter = delegateRegistryContract.filters.SetDelegate(signerAddress, formatBytes32String(delegateId), null)

      let prevBlockNumber = await web3.getBlockNumber()

      timeoutId = setInterval(async () => {
        const blocks = await delegateRegistryContract.queryFilter(filter, prevBlockNumber, 'latest')

        if (blocks.length === 0) {
          return
        }

        // Invalidate cache
        mutate()

        prevBlockNumber = blocks[blocks.length - 1].blockNumber
      }, POLLING_INTERVAL)
    })()

    return () => {
      clearInterval(timeoutId)
    }
  }, [web3, mutate])
}
