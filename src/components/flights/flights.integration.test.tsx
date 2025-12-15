import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, beforeEach, vi, expect } from 'vitest'
import { CompareFlightsDialog } from '@/components/flights/compare-flights-dialog/CompareFlightsDialog'
import type Flight from '@/services/api'
import useCompareFlightsStore from '@/stores/compareFlights'
import { useFlights } from '@/hooks/useFlights'

// ------------------------
// mock components
// ------------------------

vi.mock('@/components/flights/compare-flights-form/CompareFlightsForm', () => ({
  CompareFlightsForm: () => <div>CompareFlightsForm</div>,
}))

vi.mock('../compare-flights-information/CompareFlightsInformation', () => ({
  CompareFlightsInformation: () => <div>CompareFlightsInformation</div>,
}))

vi.mock('@/components/design-system/atoms/button/Button', () => ({
  Button: ({
    children,
    onPress,
    type,
    isDisabled,
  }: {
    children: React.ReactNode
    onPress?: () => void
    type?: 'button' | 'submit' | 'reset'
    isDisabled?: boolean
  }) => (
    <button type={type} disabled={isDisabled} onClick={onPress}>
      {children}
    </button>
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

vi.mock('@/stores/compareFlights')
vi.mock('@/hooks/useFlights')

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
  {
    flight_id: 2,
    flight_number: 'LH456',
    departure_date: '2025-01-11T12:00:00Z',
    arrival_date: '2025-01-11T14:10:00Z',
    origin: { id: 3, name: 'Frankfurt Airport', iata_code: 'FRA' },
    destination: { id: 4, name: 'Madrid Barajas', iata_code: 'MAD' },
  },
]

// ------------------------
// mocked hooks
// ------------------------

const mockedUseCompareFlightsStore = vi.mocked(useCompareFlightsStore)
const mockedUseFlights = vi.mocked(useFlights)

const setFlightId = vi.fn()
const setFlightIdToCompare = vi.fn()
const resetFlights = vi.fn()

const mockStores = (flightId?: number, flightIdToCompare?: number) => {
  mockedUseCompareFlightsStore.mockReturnValue({
    flightId,
    flightIdToCompare,
    setFlightId,
    setFlightIdToCompare,
    resetFlights,
  })

  mockedUseFlights.mockReturnValue({
    flights: flightsMock,
    isLoading: false,
  })
}

// ------------------------
// integration tests
// ------------------------
// ... previous mocks and setup ...

describe('Flight Comparison Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('full flow: open dialog, see information, review and confirm', async () => {
    mockStores(1, 2)

    render(<CompareFlightsDialog />) // only the dialog

    // --- Dialog content ---
    expect(screen.getByText('Schedule Change')).toBeInTheDocument()
    expect(screen.getByText(/Flight from CDG to LHR on Jan 10, 2025/i)).toBeInTheDocument()

    // --- Check CompareFlightsInformation content ---
    expect(screen.getAllByText(/Flight Id/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Departure Date/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Arrival Date/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Flight Number/i)[0]).toBeInTheDocument()

    // --- Review Flight ---
    const checkbox = screen.getByRole('checkbox', { name: /viewed/i })
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toBeDisabled()

    await userEvent.click(checkbox)
    expect(confirmButton).toBeEnabled()

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await userEvent.click(confirmButton)

    // --- Assertions ---
    expect(resetFlights).toHaveBeenCalledWith()
    expect(consoleSpy).toHaveBeenCalledWith({ reviewed: true })
    consoleSpy.mockRestore()
  })
})
