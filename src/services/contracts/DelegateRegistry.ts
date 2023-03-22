import type { JsonRpcProvider } from '@ethersproject/providers'

import { DELEGATE_REGISTRY_ADDRESS } from '@/config/constants'
import { DelegateRegistry__factory } from '@/types/contracts/delegate-registry'
import type { DelegateRegistry } from '@/types/contracts/delegate-registry/DelegateRegistry'

export const getDelegateRegistryContract = (provider: JsonRpcProvider): DelegateRegistry => {
  return DelegateRegistry__factory.connect(DELEGATE_REGISTRY_ADDRESS, provider.getSigner())
}
