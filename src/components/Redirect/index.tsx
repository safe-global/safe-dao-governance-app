import { useRouter } from 'next/router'
import type { UrlObject } from 'url'

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

export const Redirect = ({ url, replace }: { url: string | UrlObject; replace?: boolean }): null => {
  const router = useRouter()

  useIsomorphicLayoutEffect(() => {
    if (replace) {
      router.replace(url)
    } else {
      router.push(url)
    }
  }, [replace, router, url])

  return null
}
