import useSWRImmutable from 'swr/immutable'

import { GUARDIANS_URL } from '@/config/constants'

export type FileDelegate = {
  name: string
  address: string
  ens: string | null
  image: string
  reason: string
  contribution: string
}

const shuffleArray = <T extends unknown[]>(array: T): T => {
  return array.sort(() => Math.random() - 0.5)
}

const parseFile = async (): Promise<FileDelegate[]> => {
  return await fetch(GUARDIANS_URL)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response.json() as Promise<FileDelegate[]>
    })
    .then(shuffleArray)
}

export const useDelegatesFile = () => {
  const QUERY_KEY = 'delegates-file'

  return useSWRImmutable([QUERY_KEY], parseFile)
}
