import { useWeb3 } from './useWeb3'
import useSWRImmutable from 'swr/immutable'

export const useEnsLookup = (address: string | undefined): string | undefined => {
  const web3 = useWeb3()

  const lookupResult = useSWRImmutable(web3 && address ? `lookup-address-${address}` : null, () => {
    if (address) {
      return web3?.lookupAddress(address)
    }
    return undefined
  })

  return lookupResult.data || undefined
}
