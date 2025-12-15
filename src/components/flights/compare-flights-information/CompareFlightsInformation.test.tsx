import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import dayjs from 'dayjs'
import { CompareFlightsInformation } from './CompareFlightsInformation'
import type Flight from '@/services/api'

// --------------------
// mocks
// --------------------

vi.mock('@/hooks/useFlights', () => ({
  useFlights: vi.fn(),
}))

vi.mock('@/stores/compareFlights', () => ({
  default: vi.fn(),
}))

vi.mock('@/components/design-system/atoms/tag/Tag', () => ({
  Tag: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

// --------------------
// flight mock (based on your data)
// --------------------

const flightsMock: Flight[] = [
  {
    flight_id: 1,
    flight_number: 'AF123',
    departure_date: '2025-01-10T08:30:00Z',
    arrival_date: '2025-01-10T10:45:00Z',
    origin: {
      id: 1,
      name: 'Paris Charles de Gaulle',
      iata_code: 'CDG',
    },
    destination: {
      id: 2,
      name: 'London Heathrow',
      iata_code: 'LHR',
    },
  },
  {
    flight_id: 2,
    flight_number: 'LH456',
    departure_date: '2025-01-11T12:00:00Z',
    arrival_date: '2025-01-11T14:10:00Z',
    origin: {
      id: 3,
      name: 'Frankfurt Airport',
      iata_code: 'FRA',
    },
    destination: {
      id: 4,
      name: 'Madrid Barajas',
      iata_code: 'MAD',
    },
  },
]

// --------------------
// helpers
// --------------------

const mockUseFlights = async () => {
  const { useFlights } = await import('@/hooks/useFlights')
  ;(useFlights as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    flights: flightsMock,
  })
}

const resetFlights = vi.fn()

const mockCompareStore = async (flightId = 1, flightIdToCompare = 2) => {
  const useCompareFlightsStore = (await import('@/stores/compareFlights')).default

  ;(useCompareFlightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    flightId,
    flightIdToCompare,
    resetFlights, // <--- add this
  })
}

// --------------------
// tests
// --------------------

describe('CompareFlightsInformation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders comparison details for two flights', async () => {
    await mockUseFlights()
    await mockCompareStore()

    render(<CompareFlightsInformation />)

    // labels
    expect(screen.getByText('Flight Id:')).toBeInTheDocument()
    expect(screen.getByText('Flight Number:')).toBeInTheDocument()
    expect(screen.getByText('Departure Date:')).toBeInTheDocument()
    expect(screen.getByText('Arrival Date:')).toBeInTheDocument()

    // values (flight ids)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    // values (flight numbers)
    expect(screen.getByText('AF123')).toBeInTheDocument()
    expect(screen.getByText('LH456')).toBeInTheDocument()
  })

  it('formats departure and arrival dates correctly', async () => {
    await mockUseFlights()
    await mockCompareStore()

    render(<CompareFlightsInformation />)

    const currentDeparture = dayjs(flightsMock[0].departure_date).format('MMM DD, HH:mm')

    const compareDeparture = dayjs(flightsMock[1].departure_date).format('MMM DD, HH:mm')

    const currentArrival = dayjs(flightsMock[0].arrival_date).format('MMM DD, HH:mm')

    const compareArrival = dayjs(flightsMock[1].arrival_date).format('MMM DD, HH:mm')

    expect(screen.getByText(currentDeparture)).toBeInTheDocument()
    expect(screen.getByText(compareDeparture)).toBeInTheDocument()
    expect(screen.getByText(currentArrival)).toBeInTheDocument()
    expect(screen.getByText(compareArrival)).toBeInTheDocument()
  })

  it('renders nothing when compared flight does not exist', async () => {
    await mockUseFlights()
    await mockCompareStore(1, 999)

    render(<CompareFlightsInformation />)

    expect(screen.queryByText('Flight Id:')).not.toBeInTheDocument()
  })

  it('renders only provided details', async () => {
    await mockUseFlights()
    await mockCompareStore()

    render(<CompareFlightsInformation details={['flight_number']} />)

    expect(screen.getByText('Flight Number:')).toBeInTheDocument()
    expect(screen.queryByText('Flight Id:')).not.toBeInTheDocument()
    expect(screen.queryByText('Departure Date:')).not.toBeInTheDocument()
  })
})
