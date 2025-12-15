// store/compareFlightsStore.ts
import { create } from 'zustand'

interface CompareFlightsState {
  flightId?: number // main flight
  flightIdToCompare?: number // flight to compare
  setFlightId: (id?: number) => void
  setFlightIdToCompare: (id?: number) => void
}

const useCompareFlightsStore = create<CompareFlightsState>((set) => ({
  flightId: undefined,
  flightIdToCompare: undefined,
  setFlightId: (id?: number) => set({ flightId: id }),
  setFlightIdToCompare: (id?: number) => set({ flightIdToCompare: id }),
}))

export default useCompareFlightsStore
