import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { useIsSafeApp } from './useIsSafeApp'
import { useWallet } from './useWallet'

import SafeAppsSDK from '@safe-global/safe-apps-sdk'

export type BaseTransaction = Parameters<SafeAppsSDK['txs']['send']>[0]['txs'][number]

export type TxSender = {
  isBatchingSupported: boolean
  sendTxs: (txs: BaseTransaction[]) => Promise<unknown>
}

export const useTxSender = (): TxSender | undefined => {
  const wallet = useWallet()
  const isSafeApp = useIsSafeApp()

  const { sdk } = useSafeAppsSDK()

  if (isSafeApp && sdk) {
    return {
      isBatchingSupported: true,
      sendTxs: (txs: BaseTransaction[]) => {
        return sdk.txs.send({ txs })
      },
    }
  }

  if (wallet) {
    return {
      isBatchingSupported: false,
      sendTxs: (txs: BaseTransaction[]) => {
        // No batched txs allowed
        if (txs.length !== 1) {
          throw new Error('Batched txs are only supported when opened as Safe App')
        }
        const tx = txs[0]
        return wallet.provider.request({ method: 'eth_sendTransaction', params: [{ ...tx }] })
      },
    }
  }
}
