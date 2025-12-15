import { Tag } from '@/components/atoms/tag/Tag'
import { useFlights } from '@/hooks/useFlights'
import useCompareFlightsStore from '@/stores/compareFlights'
import { useMemo } from 'react'
import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/atoms/button/Button'
import styles from './CompareFlightsInformation.module.scss'

export const CompareFlightsInformation = () => {
  const { flightId, flightIdToCompare, setFlightIdToCompare } = useCompareFlightsStore()
  const { flights } = useFlights()

  const currentFlight = useMemo(
    () => flights?.find(({ flight_id }) => flight_id === flightId),
    [flightId, flights],
  )
  const flightToCompare = useMemo(
    () => flights?.find(({ flight_id }) => flight_id === flightIdToCompare),
    [flightIdToCompare, flights],
  )

  return (
    <div className={styles['o-compare-flights-information']}>
      <header className={styles['o-compare-flights-information__header']}>
        <div className={styles['o-compare-flights-information__flight-numbers']}>
          <Tag variant="disabled">{currentFlight?.flight_number}</Tag>
          <Tag>{flightToCompare?.flight_number}</Tag>
        </div>
        <Button variant="icon" onPress={() => setFlightIdToCompare(undefined)}>
          <RefreshCcw />
        </Button>
      </header>
      <main className={styles['o-compare-flights-information__main']}>
        {/* TODO: display properly information of each flights below */}
      </main>
      <footer className={styles['o-compare-flights-information__footer']}>
        {/* TODO: display actions */}
      </footer>
    </div>
  )
}
