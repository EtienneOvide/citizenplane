import { Tag } from '@/components/design-system/atoms/tag/Tag'
import { useFlights } from '@/hooks/useFlights'
import useCompareFlightsStore from '@/stores/compareFlights'
import { useMemo } from 'react'
import type Flight from '@/services/api'
import clsx from 'clsx'
import dayjs from 'dayjs'
import styles from './CompareFlightsInformation.module.scss'

type CompareFlightsInformationProps = {
  details?: Exclude<keyof Flight, 'origin' | 'destination'>[]
}

export const CompareFlightsInformation = ({
  details = ['flight_id', 'flight_number', 'departure_date', 'arrival_date'],
}: CompareFlightsInformationProps) => {
  const { flightId, flightIdToCompare } = useCompareFlightsStore()
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
    <div className={styles['o-compare-flights-information__informations']}>
      {currentFlight && flightToCompare && (
        <div className={styles['o-compare-flights-information__details']}>
          {details.map((key) => {
            const currentValue = currentFlight[key]
            const compareValue = flightToCompare[key]
            return (
              <div key={key} className={styles['o-compare-flights-information__detail']}>
                <div className={styles['o-compare-flights-information__label']}>
                  {key.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}:
                </div>
                <div className={styles['o-compare-flights-information__value-container']}>
                  <div
                    className={clsx(
                      styles['o-compare-flights-information__value'],
                      styles['o-compare-flights-information__value--previous'],
                    )}
                  >
                    <Tag variant="error">
                      {['arrival_date', 'departure_date'].includes(key)
                        ? dayjs(currentValue).format('MMM DD, HH:mm')
                        : currentValue}
                    </Tag>
                  </div>
                  <div
                    className={clsx(
                      styles['o-compare-flights-information__value'],
                      styles['o-compare-flights-information__value--compare'],
                    )}
                  >
                    <Tag variant="success">
                      {['arrival_date', 'departure_date'].includes(key)
                        ? dayjs(compareValue).format('MMM DD, HH:mm')
                        : compareValue}
                    </Tag>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
