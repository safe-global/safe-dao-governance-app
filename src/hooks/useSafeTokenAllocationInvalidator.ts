import { useEffect } from 'react'

import { getSafeTokenContract } from '@/services/contracts/SafeToken'
import { CHAIN_SAFE_TOKEN_ADDRESS, POLLING_INTERVAL } from '@/config/constants'
import { useWeb3 } from '@/hooks/useWeb3'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'

export const useSafeTokenAllocationInvalidator = () => {
  const web3 = useWeb3()
  const { mutate } = useSafeTokenAllocation()

  useEffect(() => {
    if (!web3) {
      return
    }

    let timeoutId: NodeJS.Timeout
    ;(async () => {
      const signer = web3.getSigner()

      const signerChainId = await signer.getChainId()

      const safeTokenAddress = CHAIN_SAFE_TOKEN_ADDRESS[signerChainId]

      if (!safeTokenAddress) {
        return
      }

      const signerAddress = await signer.getAddress()

      const safeTokenContract = getSafeTokenContract(safeTokenAddress, signer)

      // Transfer event _from_ signer
      const transferFromFilter = safeTokenContract.filters.Transfer(signerAddress, null, null)

      // Transfer event _to_ signer
      const transferToFilter = safeTokenContract.filters.Transfer(null, signerAddress, null)

      let prevBlockNumber = await web3.getBlockNumber()

      timeoutId = setInterval(async () => {
        const [transferFromBlocks, transferToBlocks] = await Promise.all([
          safeTokenContract.queryFilter(transferFromFilter, prevBlockNumber, 'latest'),
          safeTokenContract.queryFilter(transferToFilter, prevBlockNumber, 'latest'),
        ])

        if (transferFromBlocks.length === 0 && transferToBlocks.length === 0) {
          return
        }

        // Invalidate cache
        mutate()

        const prevTransferFromBlockNumber =
          transferFromBlocks[transferFromBlocks.length - 1]?.blockNumber ?? prevBlockNumber
        const prevTransferToBlockNumber = transferToBlocks[transferToBlocks.length - 1]?.blockNumber ?? prevBlockNumber

        prevBlockNumber = Math.max(prevBlockNumber, prevTransferFromBlockNumber, prevTransferToBlockNumber)
      }, POLLING_INTERVAL)
    })()

    return () => {
      clearInterval(timeoutId)
    }
  }, [web3, mutate])
}
