import { CHAIN_SHORT_NAME, SAFE_URL, DEPLOYMENT_URL } from '@/config/constants'

export const getGovernanceAppSafeAppUrl = (chainId: string, address: string): string => {
  const url = new URL(`${SAFE_URL}/apps/open`)

  const shortName = CHAIN_SHORT_NAME[chainId]
  url.searchParams.append('safe', `${shortName}:${address}`)
  url.searchParams.append('appUrl', DEPLOYMENT_URL)

  return url.toString()
}
