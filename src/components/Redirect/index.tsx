import { useRouter } from 'next/router'

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { ParsedUrlQueryInput } from 'querystring'

export const Redirect = ({
  url,
  replace,
  query,
}: {
  url: string
  replace?: boolean
  query?: ParsedUrlQueryInput
}): null => {
  const router = useRouter()

  useIsomorphicLayoutEffect(() => {
    if (replace) {
      router.replace(url)
    } else {
      router.push({ pathname: url, query })
    }
  }, [replace, router, url])

  return null
}
