import type { JsonRpcSigner } from '@ethersproject/providers'

import { DELEGATE_REGISTRY_ADDRESS } from '@/config/constants'
import { DelegateRegistry__factory } from '@/types/contracts/delegate-registry'
import type { DelegateRegistry } from '@/types/contracts/delegate-registry/DelegateRegistry'

export const getDelegateRegistryContract = (signer: JsonRpcSigner): DelegateRegistry => {
  return DelegateRegistry__factory.connect(DELEGATE_REGISTRY_ADDRESS, signer)
}
