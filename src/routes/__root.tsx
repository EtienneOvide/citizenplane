import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

const RootComponent = () => {
  const devtools = import.meta.env.VITE_DEVTOOLS === 'true'

  return (
    <>
      <Outlet />
      {devtools && (
        <>
          <ReactQueryDevtools buttonPosition="top-left" />
          <TanStackRouterDevtools />
        </>
      )}
    </>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})
