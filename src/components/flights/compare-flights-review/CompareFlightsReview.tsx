import { Tag } from '@/components/design-system/atoms/tag/Tag'
import { useFlights } from '@/hooks/useFlights'
import useCompareFlightsStore from '@/stores/compareFlights'
import { useMemo } from 'react'
import { Check, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/design-system/atoms/button/Button'
import { Checkbox } from '@/components/design-system/atoms/checkbox/Checkbox'
import { Form } from 'react-aria-components'
import { Controller, useForm, useWatch } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CompareFlightsInformation } from '../compare-flights-information/CompareFlightsInformation'
import styles from './CompareFlightsReview.module.scss'

const schema = z.object({
  reviewed: z.boolean('Reviewed is required'),
})

type ReviewFlightFormData = z.infer<typeof schema>

export const CompareFlightsReview = () => {
  const { flightId, flightIdToCompare, resetFlights, setFlightIdToCompare } =
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
    resetFlights()
    console.log(data)
  }

  const handleCancel = () => {
    resetFlights()
  }

  return (
    <div className={styles['o-compare-flights-review']}>
      <header className={styles['o-compare-flights-review__header']}>
        <div className={styles['o-compare-flights-review__flight-numbers']}>
          <Tag variant="disabled">{currentFlight?.flight_number}</Tag>
          <Tag>{flightToCompare?.flight_number}</Tag>
        </div>
        <Button variant="tertiary" onPress={() => setFlightIdToCompare(undefined)}>
          <RefreshCcw size={16} />
          Change
        </Button>
      </header>

      <Form onSubmit={handleSubmit(onSubmit)} className={styles['o-compare-flights-review__form']}>
        <div className={styles['o-compare-flights-review__container']}>
          Review changes
          <Controller
            name="reviewed"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Checkbox
                isInvalid={invalid}
                isSelected={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              >
                Viewed
              </Checkbox>
            )}
          />
        </div>
        <CompareFlightsInformation />
        <div className={styles['o-compare-flights-review__actions']}>
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
