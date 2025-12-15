import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 } },
  queryCache: new QueryCache(),
  mutationCache: new MutationCache(),
})
