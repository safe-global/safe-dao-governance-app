import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'

import { render, renderHook } from '@testing-library/react'
import type { RenderHookOptions } from '@testing-library/react'
import type { ReactNode } from 'react'

// Add in any providers here if necessary
const getProviders: () => React.FC<{ children?: ReactNode }> = () =>
  function ProviderComponent({ children }) {
    return <SafeProvider>{children}</SafeProvider>
  }

const customRender = (ui: React.ReactElement) => {
  return render(ui, { wrapper: getProviders() })
}

const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props>,
) => {
  return renderHook(render, { wrapper: getProviders(), ...options })
}

// Re-export everything
export * from '@testing-library/react'

// Override render methods
export { customRender as render }
export { customRenderHook as renderHook }
