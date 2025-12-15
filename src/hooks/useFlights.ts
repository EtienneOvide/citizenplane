import { fetchFlights } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export const useFlights = () => {
  const { data: flights, isLoading } = useQuery({
    queryKey: ['flights'],
    queryFn: fetchFlights,
  })

  return {
    flights,
    isLoading,
  }
}
