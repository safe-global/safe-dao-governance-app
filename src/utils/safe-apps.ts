import { CHAIN_SHORT_NAME, DEPLOYMENT_URL } from '@/config/constants'

export const getGovernanceAppSafeAppUrl = (chainId: number, address: string): string => {
  const url = new URL(`${location.origin}/apps/open`)

  const shortName = CHAIN_SHORT_NAME[chainId]
  url.searchParams.append('safe', `${shortName}:${address}`)
  url.searchParams.append('appUrl', DEPLOYMENT_URL)

  return url.toString()
}
