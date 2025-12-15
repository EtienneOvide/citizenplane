import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CompareFlightsForm } from './CompareFlightsForm'
import useCompareFlightsStore from '@/stores/compareFlights'
import { useFlights } from '@/hooks/useFlights'

// Mock the store
vi.mock('@/stores/compareFlights')
// Mock the hook
vi.mock('@/hooks/useFlights')

describe('CompareFlightsForm', () => {
  const setFlightIdToCompareMock = vi.fn()

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()

    // Cast to Vitest spy
    // @ts-expect-error compiler option not properly setup
    const useCompareFlightsStoreMock = useCompareFlightsStore as unknown as vi.Mock
    useCompareFlightsStoreMock.mockReturnValue({
      flightId: '1',
      setFlightIdToCompare: setFlightIdToCompareMock,
    })

    // @ts-expect-error compiler option not properly setup
    const useFlightsMock = useFlights as unknown as vi.Mock
    useFlightsMock.mockReturnValue({
      flights: [
        { flight_id: '1', flight_number: 'AA123' },
        { flight_id: '2', flight_number: 'BB456' },
      ],
    })
  })

  it('renders the form correctly', () => {
    render(<CompareFlightsForm />)
    expect(screen.getByLabelText(/enter the id of the new flight/i)).toBeInTheDocument()
    expect(screen.getByText(/compare flights/i)).toBeInTheDocument()
  })

  it('shows current flight number in the Tag', () => {
    render(<CompareFlightsForm />)
    expect(screen.getByText('AA123')).toBeInTheDocument()
  })

  it('validates empty input', async () => {
    render(<CompareFlightsForm />)
    fireEvent.click(screen.getByText(/compare flights/i))
    await waitFor(() => {
      expect(screen.getByText(/flight id is required/i)).toBeInTheDocument()
    })
  })

  it('validates invalid flight format', async () => {
    render(<CompareFlightsForm />)
    fireEvent.input(screen.getByLabelText(/enter the id of the new flight/i), {
      target: { value: '123' },
    })
    fireEvent.click(screen.getByText(/compare flights/i))
    await waitFor(() => {
      expect(screen.getByText(/invalid flight id/i)).toBeInTheDocument()
    })
  })

  it('shows error if flight not found', async () => {
    render(<CompareFlightsForm />)
    fireEvent.input(screen.getByLabelText(/enter the id of the new flight/i), {
      target: { value: 'CC789' },
    })
    fireEvent.click(screen.getByText(/compare flights/i))
    await waitFor(() => {
      expect(screen.getByText(/flight not found/i)).toBeInTheDocument()
    })
    expect(setFlightIdToCompareMock).not.toHaveBeenCalled()
  })

  it('calls setFlightIdToCompare on valid submission', async () => {
    render(<CompareFlightsForm />)
    fireEvent.input(screen.getByLabelText(/enter the id of the new flight/i), {
      target: { value: 'BB456' },
    })
    fireEvent.click(screen.getByText(/compare flights/i))
    await waitFor(() => {
      expect(setFlightIdToCompareMock).toHaveBeenCalledWith('2')
    })
  })
})
