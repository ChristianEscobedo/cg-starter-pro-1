import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { Settings, Users, Palette, MessageSquare, Image, CreditCard, BarChart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your AI Post Creator settings',
}

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/content-cards">
          <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <MessageSquare className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Content Cards</CardTitle>
              <CardDescription>Manage content cards and AI prompts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and configure different content cards with custom AI prompts and variables
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/white-label">
          <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <Palette className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>White Label</CardTitle>
              <CardDescription>Customize branding and appearance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Change platform name, colors, and logo to match your brand identity
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <Users className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and assign credits</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage users, assign credits, and monitor user activity
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/credit-packages">
          <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <CreditCard className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Credit Packages</CardTitle>
              <CardDescription>Configure credit packages and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage credit packages with different amounts and pricing options
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/economics">
          <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <BarChart className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Economics</CardTitle>
              <CardDescription>View platform economics and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor revenue, credit usage, and other key performance indicators
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/ai-settings">
          <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <Settings className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>AI Settings</CardTitle>
              <CardDescription>Configure AI providers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set up and configure AI providers including OpenAI, Claude, DeepSeek, and Vercel AI
                SDK
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/image-settings">
          <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <Image className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Image Settings</CardTitle>
              <CardDescription>Configure image generation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set up FAL for AI image generation and configure image styles and settings
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/tenants">
          <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <Users className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Tenants</CardTitle>
              <CardDescription>Manage tenant accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage tenant accounts, monitor usage, and invite new users
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
