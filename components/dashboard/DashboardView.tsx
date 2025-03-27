'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CreditDisplay from './CreditDisplay'
import UsageStats from './UsageStats'
import RecentActivity from './RecentActivity'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardView() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your account and view your usage</p>
        </div>
        <CreditDisplay />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">250</div>
                <p className="text-xs text-muted-foreground">+20 from your last purchase</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+3 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Post Sequences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">+1 from last week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent posts and credit usage</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Your credit usage over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <UsageStats />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Link href="/ai-post-creator">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create New Post
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Posts</CardTitle>
              <CardDescription>Manage and view your created posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-8 text-center">
                <p className="text-muted-foreground">Your post history will appear here</p>
                <Link href="/ai-post-creator">
                  <Button className="mt-4 gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create New Post
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit History</CardTitle>
              <CardDescription>View your credit purchases and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between rounded-md border p-4">
                  <div>
                    <p className="font-medium">Credit Purchase</p>
                    <p className="text-sm text-muted-foreground">May 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+100 credits</p>
                    <p className="text-sm text-muted-foreground">$9.99</p>
                  </div>
                </div>
                <div className="flex justify-between rounded-md border p-4">
                  <div>
                    <p className="font-medium">Post Creation</p>
                    <p className="text-sm text-muted-foreground">May 14, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">-5 credits</p>
                    <p className="text-sm text-muted-foreground">Facebook Post</p>
                  </div>
                </div>
                <div className="flex justify-between rounded-md border p-4">
                  <div>
                    <p className="font-medium">Post Sequence</p>
                    <p className="text-sm text-muted-foreground">May 12, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">-15 credits</p>
                    <p className="text-sm text-muted-foreground">3 Facebook Posts</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
