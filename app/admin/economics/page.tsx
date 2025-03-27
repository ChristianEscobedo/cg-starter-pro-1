import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SimpleBarChart from './components/SimpleBarChart'

export const metadata: Metadata = {
  title: 'Economics Dashboard',
  description: 'View platform economics and metrics',
}

// Mock data - would be replaced with real data from API
const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 7000 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 8000 },
]

const usageData = [
  { month: 'Jan', credits: 2000 },
  { month: 'Feb', credits: 4000 },
  { month: 'Mar', credits: 6000 },
  { month: 'Apr', credits: 8000 },
  { month: 'May', credits: 9000 },
  { month: 'Jun', credits: 10000 },
]

export default function EconomicsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Economics Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$33,000</div>
            <p className="text-sm text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credits Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">39,000</div>
            <p className="text-sm text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">1,245</div>
            <p className="text-sm text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="revenue">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="usage">Credit Usage</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="mt-4">
            <SimpleBarChart
              title="Monthly Revenue"
              data={revenueData}
              dataKey="revenue"
              color="#8884d8"
            />
          </TabsContent>
          <TabsContent value="usage" className="mt-4">
            <SimpleBarChart
              title="Monthly Credit Usage"
              data={usageData}
              dataKey="credits"
              color="#82ca9d"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
