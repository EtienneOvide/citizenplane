import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { CompareFlightsReview } from './CompareFlightsReview'
import type Flight from '@/services/api'

// --------------------------------------------------
// mocks
// --------------------------------------------------

vi.mock('@/hooks/useFlights', () => ({
  useFlights: vi.fn(),
}))

vi.mock('@/stores/compareFlights', () => ({
  default: vi.fn(),
}))

vi.mock('@/components/design-system/atoms/tag/Tag', () => ({
  Tag: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

vi.mock('@/components/design-system/atoms/button/Button', () => ({
  Button: ({
    children,
    onPress,
    type = 'button',
    isDisabled,
  }: {
    children: React.ReactNode
    onPress?: () => void
    type?: 'button' | 'submit' | 'reset'
    isDisabled?: boolean
  }) => (
    <button type={type} disabled={isDisabled} onClick={() => onPress?.()}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/design-system/atoms/checkbox/Checkbox', () => ({
  Checkbox: ({
    children,
    isSelected,
    onChange,
  }: {
    children: React.ReactNode
    isSelected: boolean
    onChange: (v: boolean) => void
  }) => (
    <label>
      <input type="checkbox" checked={isSelected} onChange={(e) => onChange(e.target.checked)} />
      {children}
    </label>
  ),
}))

vi.mock('../compare-flights-information/CompareFlightsInformation', () => ({
  CompareFlightsInformation: () => <div>CompareFlightsInformation</div>,
}))

// --------------------------------------------------
// flight mock (matches your real data shape)
// --------------------------------------------------

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

// --------------------------------------------------
// store spies
// --------------------------------------------------

const setFlightId = vi.fn()
const setFlightIdToCompare = vi.fn()
const resetFlights = vi.fn()

const mockUseFlights = async () => {
  const { useFlights } = await import('@/hooks/useFlights')
  ;(useFlights as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    flights: flightsMock,
  })
}

const mockCompareStore = async (flightId = 1, flightIdToCompare = 2) => {
  const useCompareFlightsStore = (await import('@/stores/compareFlights')).default

  ;(useCompareFlightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    flightId,
    flightIdToCompare,
    setFlightId,
    setFlightIdToCompare,
    resetFlights,
  })
}

// --------------------------------------------------
// tests
// --------------------------------------------------

describe('CompareFlightsReview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders flight numbers in header', async () => {
    await mockUseFlights()
    await mockCompareStore()

    render(<CompareFlightsReview />)

    expect(screen.getByText('AF123')).toBeInTheDocument()
    expect(screen.getByText('LH456')).toBeInTheDocument()
  })

  it('disables confirm button until checkbox is checked', async () => {
    await mockUseFlights()
    await mockCompareStore()

    render(<CompareFlightsReview />)

    const confirmButton = screen.getByRole('button', {
      name: /confirm/i,
    })

    expect(confirmButton).toBeDisabled()

    fireEvent.click(screen.getByRole('checkbox'))

    expect(confirmButton).toBeEnabled()
  })

  it('calls setFlightIdToCompare when clicking Change', async () => {
    await mockUseFlights()
    await mockCompareStore()

    render(<CompareFlightsReview />)

    fireEvent.click(screen.getByRole('button', { name: /change/i }))

    expect(setFlightIdToCompare).toHaveBeenCalledWith(undefined)
  })

  it('resets flight ids when clicking Cancel', async () => {
    await mockUseFlights()
    await mockCompareStore()

    render(<CompareFlightsReview />)

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(resetFlights).toHaveBeenCalledWith()
  })

  it('submits form and resets flight ids when confirmed', async () => {
    await mockUseFlights()
    await mockCompareStore()

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(<CompareFlightsReview />)

    // check the checkbox
    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)

    // click confirm button
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await userEvent.click(confirmButton)

    expect(resetFlights).toHaveBeenCalledWith()
    expect(consoleSpy).toHaveBeenCalledWith({ reviewed: true })

    consoleSpy.mockRestore()
  })
})
