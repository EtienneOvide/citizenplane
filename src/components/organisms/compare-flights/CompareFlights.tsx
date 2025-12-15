import { CompareFlightsForm } from '@/components/organisms/compare-flights-form/CompareFlightsForm'
import { CompareFlightsInformation } from '../compare-flights-information/CompareFlightsInformation'
import useCompareFlightsStore from '@/stores/compareFlights'

export const CompareFlights = () => {
  const { flightIdToCompare } = useCompareFlightsStore()
  return !flightIdToCompare ? <CompareFlightsForm /> : <CompareFlightsInformation />
}
