import { useEffect } from 'react'

import { ExternalStore } from '@/services/ExternalStore'
import { useWallet } from '@/hooks/useWallet'
import { didRevert } from '@/utils/transactions'
import { useWeb3 } from '@/hooks/useWeb3'
import { useContractDelegate } from './useContractDelegate'

// Note: only EOA transactions can be pending

type TransactionHash = string
const delegateTxsStore = new ExternalStore<{ [providerAddress: string]: TransactionHash | undefined }>({})

export const setPendingDelegation = (providerAddress: string, txHash: TransactionHash) => {
  delegateTxsStore.setStore((delegations) => ({
    ...delegations,
    [providerAddress]: txHash,
  }))
}

const removePendingDelegation = (providerAddress: string) => {
  delegateTxsStore.setStore((prev = {}) => {
    prev[providerAddress] = undefined
    return prev
  })
}

export const usePendingDelegations = () => {
  const web3 = useWeb3()
  const delegations = delegateTxsStore.useStore()
  const wallet = useWallet()
  const { mutate } = useContractDelegate()

  useEffect(() => {
    if (!wallet?.chainId || !wallet?.address || !web3) {
      return
    }

    const txHash = delegations?.[wallet.address]

    if (!txHash) {
      return
    }

    const TIMEOUT_MINUTES = 6.5

    // Return receipt after 1 additional block was mined/validated or until timeout
    // https://docs.ethers.io/v5/single-page/#/v5/api/providers/provider/-%23-Provider-waitForTransaction
    web3
      .waitForTransaction(txHash, 1, TIMEOUT_MINUTES * 60_000)
      .then((receipt) => {
        if (didRevert(receipt)) {
          console.error('Delegation reverted', receipt)
        } else {
          // Invalidate cache
          mutate()
        }
      })
      .catch((err) => {
        console.error('Delegation failed', err)
      })
      .finally(() => {
        removePendingDelegation(wallet.address)
      })

    return () => {
      web3.off(txHash)
    }
  }, [delegations, mutate, wallet?.address, wallet?.chainId, web3])
}

export const useIsDelegationPending = (): boolean => {
  const delegations = delegateTxsStore.useStore()
  const wallet = useWallet()

  return wallet ? !!delegations?.[wallet.address] : false
}
