import useSWR from 'swr'
import { GATEWAY_URL } from '@/config/constants'

export type SealedRequest = {
  requestId: string
  sealedResult?: string
}

type Eligibility = {
  requestId: string
  isAllowed: boolean
  isVpn: boolean
}

const fetchUnsealedResult = async (sealedRequest: SealedRequest) => {
  return fetch(`${GATEWAY_URL}/v1/community/eligibility`, {
    method: 'POST',
    body: JSON.stringify({
      requestId: sealedRequest.requestId,
      sealedData: sealedRequest.sealedResult,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((resp) => {
    if (resp.ok) {
      return resp.json() as Promise<Eligibility>
    } else {
      throw Error('Error fetching eligibility')
    }
  })
}

const useUnsealedResult = (sealedRequest?: SealedRequest) => {
  const QUERY_KEY = 'unsealed-result'

  const { data, isLoading } = useSWR(sealedRequest ? QUERY_KEY : null, async () => {
    if (!sealedRequest) return

    return await fetchUnsealedResult(sealedRequest)
  })

  return { data, isLoading }
}

export default useUnsealedResult
