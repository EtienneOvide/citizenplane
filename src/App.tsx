import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/lib/router'

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} defaultPreload="intent" context={{ queryClient }} />
    </QueryClientProvider>
  )
}
