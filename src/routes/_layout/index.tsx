import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/atoms/button/Button'
import { Dialog } from '@/components/organisms/dialog/Dialog'
import { useMemo } from 'react'
import { CompareFlights } from '@/components/organisms/compare-flights/CompareFlights'
import useCompareFlightsStore from '@/stores/compareFlights'
import { useFlights } from '@/hooks/useFlights'
import dayjs from 'dayjs'

const RouteComponent = () => {
  const { flightId, setFlightId } = useCompareFlightsStore()
  const { flights } = useFlights()

  const flightInformationFormatted = useMemo(() => {
    const currentFlight = flights?.find(({ flight_id }) => flight_id === flightId)
    return currentFlight
      ? `Flight from ${currentFlight.origin.iata_code} to ${currentFlight.destination.iata_code} on ${dayjs(currentFlight.departure_date).format('MMM DD, YYYY')}`
      : ''
  }, [flightId, flights])

  return (
    <Dialog
      displayCloseButton
      isOpen={!!flightId}
      width="31rem"
      onClose={() => setFlightId(undefined)}
      title="Schedule Change"
      subtitle={flightInformationFormatted}
      component={<CompareFlights />}
    >
      <Button variant="primary" onPress={() => setFlightId(1)}>
        Schedule Change
      </Button>
    </Dialog>
  )
}

export const Route = createFileRoute('/_layout/')({
  component: RouteComponent,
})
