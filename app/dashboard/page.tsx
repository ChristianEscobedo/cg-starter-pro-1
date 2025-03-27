import { Metadata } from 'next'
import DashboardView from '@/components/dashboard/DashboardView'

export const metadata: Metadata = {
  title: 'Dashboard | CodeGuide Starter Pro',
  description: 'Manage your account and view your usage',
}

export default function DashboardPage() {
  return <DashboardView />
}
