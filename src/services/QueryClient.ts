import { QueryClient } from '@tanstack/react-query'
import type { ContractTransaction } from '@ethersproject/contracts'

import { didRevert } from '@/utils/transactions'

const _queryClient = new QueryClient()

export const getQueryClient = () => {
  return _queryClient
}

let txWatchers: { [QUERY_KEY: string]: Promise<void>[] } = {}

/**
 * Waits for a transaction to be mined and invalidates the cache for the given query key.
 * We cannot await a transaction receipt directly because Safe transactions that require
 * multiple confirmations would block the UI.
 *
 * @param queryKey react-query cache key
 * @param tx ethers contract transaction
 */

export const invalidateCacheAfterTx = (queryKey: string, tx: ContractTransaction): void => {
  const txWatcher = tx
    .wait()
    .then((receipt) => {
      if (didRevert(receipt)) {
        console.error(`${queryKey} transaction reverted`, receipt)
      } else {
        _queryClient.invalidateQueries({ queryKey: [queryKey] })
      }
    })
    .catch((e) => {
      console.error(`${queryKey} transaction failed`, e)
    })

  txWatchers[queryKey] ??= []

  // We do not replace previous "watchers", even for the same address as they
  // may resolve before one another
  txWatchers[queryKey].push(txWatcher)
}
