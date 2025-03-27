import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CreditPackageList from '@/components/admin/CreditPackageList'
import CreateCreditPackageForm from '@/components/admin/CreateCreditPackageForm'

export const metadata: Metadata = {
  title: 'Credit Packages',
  description: 'Manage credit packages and pricing',
}

export default function CreditPackagesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Credit Packages</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Package</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateCreditPackageForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <CreditPackageList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
