/* eslint-disable @typescript-eslint/no-empty-function */

import { createContext, useContext, useRef } from 'react'

type ScrollContextType = {
  storeScrollPosition: () => void
  setScrollPosition: (top: number) => void
  restoreScrollPosition: () => void
}

const ScrollContext = createContext<ScrollContextType>({
  storeScrollPosition: () => {},
  setScrollPosition: () => {},
  restoreScrollPosition: () => {},
})

export const ScrollContextProvider = ({ children }: { children: JSX.Element }) => {
  const scrollPosition = useRef<number>()

  const storeScrollPosition = () => {
    scrollPosition.current = document.documentElement.scrollTop
  }

  const setScrollPosition = (top?: number) => {
    // Scroll in next frame to avoid scroll position being reset
    setTimeout(() => {
      document.documentElement.scrollTo({ top })
    })
  }

  const restoreScrollPosition = (top?: number) => {
    if (scrollPosition.current) {
      setScrollPosition(scrollPosition.current)

      scrollPosition.current = undefined
    }
  }

  return (
    <ScrollContext.Provider
      value={{
        storeScrollPosition,
        setScrollPosition,
        restoreScrollPosition,
      }}
    >
      {children}
    </ScrollContext.Provider>
  )
}

export const useScrollContext = () => {
  const stepperContext = useContext(ScrollContext)

  if (!stepperContext) {
    throw new Error('useScrollContext must be used within a ScrollContextProvider')
  }

  return stepperContext
}
