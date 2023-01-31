import { useEffect } from 'react'
import type { ContractTransaction } from 'ethers/lib/ethers'

import { ExternalStore } from '@/services/ExternalStore'
import { useWallet } from './useWallet'
import { didRevert } from '@/utils/transactions'

// Note: only EOA transactions can be pending

const delegateTxsStore = new ExternalStore<{ [providerAddress: string]: ContractTransaction }>()

export const setPendingDelegation = (providerAddress: string, tx: ContractTransaction) => {
  delegateTxsStore.setStore((delegations) => ({
    ...delegations,
    [providerAddress]: tx,
  }))
}

const removePendingDelegation = (providerAddress: string) => {
  delegateTxsStore.setStore(({ [providerAddress]: _, ...rest } = {}) => rest)
}

export const usePendingDelegations = () => {
  const delegations = delegateTxsStore.useStore()
  const wallet = useWallet()

  useEffect(() => {
    let isMounted = true

    if (!wallet?.address) {
      return
    }

    delegations?.[wallet.address]
      ?.wait()
      .then((receipt) => {
        if (didRevert(receipt)) {
          console.error('Delegation reverted', receipt)
        }
      })
      .catch((err) => {
        console.error('Delegation failed', err)
      })
      .finally(() => {
        if (isMounted) {
          removePendingDelegation(wallet.address)
        }
      })

    return () => {
      isMounted = false
    }
  }, [wallet?.address, delegations])
}

export const useIsDelegationPending = (): boolean => {
  const delegations = delegateTxsStore.useStore()
  const wallet = useWallet()

  return wallet?.address ? !!delegations?.[wallet.address] : false
}
