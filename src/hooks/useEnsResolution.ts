import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { getAddress, isAddress } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'

import { parsePrefixedAddress, sameAddress } from '@/utils/addresses'
import { useChain } from '@/hooks/useChain'
import { useWeb3 } from '@/hooks/useWeb3'
import { useWallet } from '@/hooks/useWallet'

export const useEnsResolution = (str: string, debounce = true): [string | undefined, string | undefined, boolean] => {
  const [result, setResult] = useState<string>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const web3 = useWeb3()
  const wallet = useWallet()
  const { safe } = useSafeAppsSDK()
  const chain = useChain()
  const shortName = chain?.shortName

  useEffect(() => {
    let isMounted = true

    isMounted && setResult(undefined)
    isMounted && setError(undefined)

    if (str.length === 0) {
      isMounted && setLoading(false)
      return
    }

    const { prefix, address } = parsePrefixedAddress(str)

    // Incorrect chain prefix
    if (prefix && shortName && prefix !== shortName) {
      isMounted && setError(`The chain prefix does not match that of the current chain (${shortName})`)
      isMounted && setLoading(false)
      return
    }

    // Valid address
    if (isAddress(address)) {
      const checksummedAddress = getAddress(address)

      const error = sameAddress(address, safe.safeAddress)
        ? 'You cannot delegate to your own Safe Account'
        : sameAddress(address, wallet?.address || '')
        ? 'You cannot delegate to your own wallet'
        : undefined

      isMounted && setResult(checksummedAddress)
      isMounted && setError(error)
      isMounted && setLoading(false)
      return
    }

    const resolveAddress = async () => {
      let resolvedAddress: string | null = null

      isMounted && setLoading(true)

      if (!web3) {
        isMounted && setError('Unable to load provider')
        isMounted && setLoading(false)
        return
      }

      try {
        resolvedAddress = await web3.resolveName(address)
      } catch (err) {
        console.error(err)

        // Resolution error
        isMounted && setError('Error while resolving ENS')
        isMounted && setLoading(false)

        return
      }

      // Invalid resolution
      if (!resolvedAddress || !isAddress(resolvedAddress)) {
        isMounted && setError('Invalid ENS')
        isMounted && setLoading(false)
        return
      }

      // Attempted to delegate to own Safe
      if (sameAddress(resolvedAddress, safe.safeAddress)) {
        isMounted && setError('You cannot delegate to your own Safe Account')
        isMounted && setLoading(false)
        return
      }

      // Attempted to delegate to own wallet
      if (sameAddress(resolvedAddress, wallet?.address || '')) {
        isMounted && setError('You cannot delegate to your own wallet')
        isMounted && setLoading(false)
        return
      }

      // Resolve ENS name
      isMounted && setResult(resolvedAddress)
      isMounted && setLoading(false)
    }

    let ensTimeout: NodeJS.Timeout | undefined

    if (debounce) {
      ensTimeout = setTimeout(resolveAddress, 300)
    } else {
      resolveAddress()
    }

    return () => {
      clearTimeout(ensTimeout)
      isMounted = false
    }
  }, [debounce, str, web3, shortName, safe.safeAddress, wallet?.address])

  return [result, error, loading]
}
