import { CompareFlightsDialog } from '@/components/flights/compare-flights-dialog/CompareFlightsDialog'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return <CompareFlightsDialog />
}

export const Route = createFileRoute('/_layout/')({
  component: RouteComponent,
})
