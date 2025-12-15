import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, beforeEach, expect, vi } from 'vitest'

import { CompareFlightsDialog } from './CompareFlightsDialog'
import type Flight from '@/services/api'

import useCompareFlightsStore from '@/stores/compareFlights'
import { useFlights } from '@/hooks/useFlights'

// ------------------------
// mocks for components
// ------------------------

vi.mock('@/stores/compareFlights')
vi.mock('@/hooks/useFlights')

vi.mock('@/components/flights/compare-flights-form/CompareFlightsForm', () => ({
  CompareFlightsForm: () => <div>CompareFlightsForm</div>,
}))

vi.mock('../compare-flights-information/CompareFlightsInformation', () => ({
  CompareFlightsInformation: () => <div>CompareFlightsInformation</div>,
}))

vi.mock('@/components/design-system/atoms/button/Button', () => ({
  Button: ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => (
    <button onClick={onPress}>{children}</button>
  ),
}))

vi.mock('@/components/design-system/organisms/dialog/Dialog', () => ({
  Dialog: ({
    isOpen,
    children,
    title,
    subtitle,
    component,
  }: {
    isOpen: boolean
    children: React.ReactNode
    title: string
    subtitle: string
    component: React.ReactNode
  }) =>
    isOpen ? (
      <div>
        {title}
        {subtitle}
        {component}
        {children}
      </div>
    ) : null,
}))

// ------------------------
// mock data
// ------------------------

const flightsMock: Flight[] = [
  {
    flight_id: 1,
    flight_number: 'AF123',
    departure_date: '2025-01-10T08:30:00Z',
    arrival_date: '2025-01-10T10:45:00Z',
    origin: { id: 1, name: 'Paris Charles de Gaulle', iata_code: 'CDG' },
    destination: { id: 2, name: 'London Heathrow', iata_code: 'LHR' },
  },
]

// ------------------------
// mocked hooks
// ------------------------

const mockedUseCompareFlightsStore = vi.mocked(useCompareFlightsStore)
const mockedUseFlights = vi.mocked(useFlights)

const setFlightId = vi.fn()

const mockStores = (flightId?: number, flightIdToCompare?: number) => {
  mockedUseCompareFlightsStore.mockReturnValue({
    flightId,
    flightIdToCompare,
    setFlightId,
  })

  mockedUseFlights.mockReturnValue({
    flights: flightsMock,
    isLoading: false,
  })
}

// ------------------------
// tests
// ------------------------

describe('CompareFlightsDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when flightId is undefined', () => {
    mockStores(undefined)
    render(<CompareFlightsDialog />)

    expect(screen.queryByText(/Schedule Change/i)).not.toBeInTheDocument()
  })

  it('renders dialog when flightId is set', () => {
    mockStores(1)
    render(<CompareFlightsDialog />)

    expect(screen.getByText('Schedule Change')).toBeInTheDocument()
    expect(screen.getByText(/Flight from CDG to LHR on Jan 10, 2025/i)).toBeInTheDocument()
    expect(screen.getByText('CompareFlightsForm')).toBeInTheDocument()
  })

  it('renders CompareFlightsInformation if flightIdToCompare is set', () => {
    mockStores(1, 2)
    render(<CompareFlightsDialog />)

    expect(screen.getByText('CompareFlightsInformation')).toBeInTheDocument()
    expect(screen.queryByText('CompareFlightsForm')).not.toBeInTheDocument()
  })

  it('calls setFlightId when button is clicked', async () => {
    mockStores(1)
    render(<CompareFlightsDialog />)

    const button = screen.getByText('Schedule Change')
    await userEvent.click(button)

    expect(setFlightId).toHaveBeenCalledWith(1)
  })
})
