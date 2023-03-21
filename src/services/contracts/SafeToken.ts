import type { JsonRpcSigner } from '@ethersproject/providers'

import { SafeToken__factory } from '@/types/contracts/safe-token'
import type { SafeTokenInterface, SafeToken } from '@/types/contracts/safe-token/SafeToken'

export const getSafeTokenInterface = (): SafeTokenInterface => {
  return SafeToken__factory.createInterface()
}

export const getSafeTokenContract = (safeTokenAddress: string, signer: JsonRpcSigner): SafeToken => {
  return SafeToken__factory.connect(safeTokenAddress, signer)
}
