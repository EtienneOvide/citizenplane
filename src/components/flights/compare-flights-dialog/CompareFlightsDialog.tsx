import { CompareFlightsForm } from '@/components/flights/compare-flights-form/CompareFlightsForm'
import { CompareFlightsReview } from '../compare-flights-review/CompareFlightsReview'
import useCompareFlightsStore from '@/stores/compareFlights'
import { Button } from '@/components/design-system/atoms/button/Button'
import { Dialog } from '@/components/design-system/organisms/dialog/Dialog'
import { useMemo } from 'react'
import { useFlights } from '@/hooks/useFlights'
import dayjs from 'dayjs'

export const CompareFlightsDialog = () => {
  const { flightIdToCompare, flightId, setFlightId, resetFlights } = useCompareFlightsStore()
  const { flights } = useFlights()

  const flightInformationFormatted = useMemo(() => {
    const currentFlight = flights?.find(({ flight_id }) => flight_id === flightId)
    return currentFlight
      ? `Flight from ${currentFlight.origin.iata_code} to ${currentFlight.destination.iata_code} on ${dayjs(currentFlight.departure_date).format('MMM DD, YYYY')}`
      : ''
  }, [flightId, flights])

  return (
    <Dialog
      isOpen={!!flightId}
      width="31rem"
      onClose={() => resetFlights()}
      title="Schedule Change"
      subtitle={flightInformationFormatted}
      component={!flightIdToCompare ? <CompareFlightsForm /> : <CompareFlightsReview />}
    >
      <Button variant="primary" onPress={() => setFlightId(1)}>
        Schedule Change
      </Button>
    </Dialog>
  )
}
