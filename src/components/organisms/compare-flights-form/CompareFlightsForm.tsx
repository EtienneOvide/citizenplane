import { Tag } from '@/components/atoms/tag/Tag'
import { Form, Separator } from 'react-aria-components'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/button/Button'
import { TextField } from '@/components/molecules/text-field/TextField'
import useCompareFlightsStore from '@/stores/compareFlights'
import styles from './CompareFlightsForm.module.scss'
import { useFlights } from '@/hooks/useFlights'
import { useMemo } from 'react'

const schema = z.object({
  flight_number: z.string('Flight ID is required').regex(/^[A-Z]{2}\d{1,4}$/i, 'Invalid flight ID'), // 2 letters + 1-4 digits
})

type CompareFlightFormData = z.infer<typeof schema>

export const CompareFlightsForm = () => {
  const { flightId, setFlightIdToCompare } = useCompareFlightsStore()
  const { flights } = useFlights()

  const {
    handleSubmit,
    control,
    setError,
    formState: { isSubmitting },
  } = useForm<CompareFlightFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      flight_number: undefined,
    },
  })

  const flightNumber = useMemo(
    () => flights?.find(({ flight_id }) => flight_id === flightId)?.flight_number,
    [flightId, flights],
  )

  const onSubmit = async (data: CompareFlightFormData) => {
    const foundFlight = flights?.find(({ flight_number }) => flight_number === data.flight_number)
    if (!foundFlight) {
      setError('flight_number', {
        type: 'manual',
        message: 'Flight not found',
      })
      return
    }
    setFlightIdToCompare(foundFlight.flight_id)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles['o-compare-flights-form']}>
      <div className={styles['o-compare-flights-form__container']}>
        <Controller
          name="flight_number"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              label="Enter the ID of the new flight."
              headerContent={<Tag variant="disabled">{flightNumber}</Tag>}
              isInvalid={invalid}
              errorMessage={error?.message}
              {...field}
            />
          )}
        />
      </div>
      <Separator className={styles['o-compare-flights-form__separator']} />
      <div className={styles['o-compare-flights-form__container']}>
        <Button type="submit" width="full" isPending={isSubmitting}>
          Compare Flights
        </Button>
      </div>
    </Form>
  )
}
