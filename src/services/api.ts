import flights from '@/mocks/flight.json'

type Airport = { name: string; iata_code: string; id: number }

export default interface Flight {
  origin: Airport
  destination: Airport
  flight_id: number
  departure_date: string
  arrival_date: string
  flight_number: string
}

export const fetchFlights = async (): Promise<Flight[]> => {
  // Simulate a api response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(flights)
    }, 200)
  })
}
