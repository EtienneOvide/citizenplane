import { Tag } from '@/components/atoms/tag/Tag'
import { useFlights } from '@/hooks/useFlights'
import useCompareFlightsStore from '@/stores/compareFlights'
import { useMemo } from 'react'
import { Check, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/atoms/button/Button'
import styles from './CompareFlightsInformation.module.scss'
import { Checkbox } from '@/components/atoms/checkbox/Checkbox'
import { Form } from 'react-aria-components'
import { Controller, useForm, useWatch } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type Flight from '@/services/api'
import clsx from 'clsx'

const schema = z.object({
  reviewed: z.boolean('Reviewed is required'),
})

type ReviewFlightFormData = z.infer<typeof schema>

export const CompareFlightsInformation = () => {
  const { flightId, flightIdToCompare, setFlightId, setFlightIdToCompare } =
    useCompareFlightsStore()
  const { flights } = useFlights()

  const currentFlight = useMemo(
    () => flights?.find(({ flight_id }) => flight_id === flightId),
    [flightId, flights],
  )
  const flightToCompare = useMemo(
    () => flights?.find(({ flight_id }) => flight_id === flightIdToCompare),
    [flightIdToCompare, flights],
  )

  const { handleSubmit, control } = useForm<ReviewFlightFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      reviewed: false,
    },
  })

  const reviewedValue = useWatch({
    control,
    name: 'reviewed',
  })

  const onSubmit = async (data: ReviewFlightFormData) => {
    setFlightId(undefined)
    setFlightIdToCompare(undefined)
    console.log(data)
  }

  const handleCancel = () => {
    setFlightId(undefined)
    setFlightIdToCompare(undefined)
  }

  return (
    <div className={styles['o-compare-flights-information']}>
      <header className={styles['o-compare-flights-information__header']}>
        <div className={styles['o-compare-flights-information__flight-numbers']}>
          <Tag variant="disabled">{currentFlight?.flight_number}</Tag>
          <Tag>{flightToCompare?.flight_number}</Tag>
        </div>
        <Button variant="icon" onPress={() => setFlightIdToCompare(undefined)}>
          <RefreshCcw size={16} />
          Change
        </Button>
      </header>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        className={styles['o-compare-flights-information__form']}
      >
        <div className={styles['o-compare-flights-information__container']}>
          Review changes
          <Controller
            name="reviewed"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Checkbox
                isInvalid={invalid}
                isSelected={field.value || false}
                onChange={field.onChange}
                onBlur={field.onBlur}
              >
                Viewed
              </Checkbox>
            )}
          />
        </div>
        <div className={styles['o-compare-flights-information__informations']}>
          <div className={styles['o-compare-flights-information__informations']}>
            {currentFlight && flightToCompare && (
              <div className={styles['o-compare-flights-information__details']}>
                {(Object.keys(currentFlight) as (keyof Flight)[])
                  // remove destination and origin
                  .filter((key) => {
                    const value = currentFlight[key]
                    return typeof value === 'string' || typeof value === 'number'
                  })
                  .map((key) => {
                    const currentValue = currentFlight[key] as string | number
                    const compareValue = flightToCompare[key] as string | number
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
                            <Tag variant="error">{currentValue}</Tag>
                          </div>
                          <div
                            className={clsx(
                              styles['o-compare-flights-information__value'],
                              styles['o-compare-flights-information__value--compare'],
                            )}
                          >
                            <Tag variant="success">{compareValue}</Tag>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </div>
        <div className={styles['o-compare-flights-information__actions']}>
          <Button variant="secondary" onPress={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" isDisabled={!reviewedValue}>
            Confirm <Check size={16} />
          </Button>
        </div>
      </Form>
    </div>
  )
}
