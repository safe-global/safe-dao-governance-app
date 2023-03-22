import useSWRImmutable from 'swr/immutable'

import { CHAIN_DELEGATE_ID } from '@/config/constants'
import { useChainId } from './useChainId'

type ShapshotProposalVars = {
  space: string
  first: number
  skip: number
  orderBy: 'created'
  orderDirection: 'desc' | 'asc'
}

export type SnapshotProposal = {
  id: string
  title: string
  state: 'active' | 'closed' | 'pending'
  author: string
}

type GqlResponse = {
  data: {
    proposals: SnapshotProposal[]
  }
  errors?: Error[]
}

const getSnapshot = async (variables: ShapshotProposalVars): Promise<SnapshotProposal[]> => {
  const SNAPSHOT_GQL_ENDPOINT = 'https://hub.snapshot.org/graphql'

  const query = `
        query ($first: Int, $skip: Int, $space: String, $orderBy: String, $orderDirection: OrderDirection) {
            proposals(
                first: $first,
                skip: $skip,
                orderBy: $orderBy,
                orderDirection: $orderDirection
                where: { space_in: [$space] },
            ) {
                id
                title
                state
                author
            }
        }
    `

  const { data, errors } = (await fetch(SNAPSHOT_GQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json())) as GqlResponse

  // GraphQL returns an array of errors in res.errors
  if (errors) {
    throw errors[0]
  }

  return data.proposals
}

const getSafeSnapshot = (space: string): Promise<SnapshotProposal[]> => {
  const PROPOSAL_AMOUNT = 3

  return getSnapshot({
    space,
    first: PROPOSAL_AMOUNT,
    skip: 0,
    orderBy: 'created',
    orderDirection: 'desc',
  })
}

export const useSafeSnapshot = () => {
  const QUERY_KEY = 'snapshot'

  const chainId = useChainId()

  return useSWRImmutable([QUERY_KEY, chainId], () => getSafeSnapshot(CHAIN_DELEGATE_ID[chainId]))
}
