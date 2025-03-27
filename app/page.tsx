import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight, CreditCard, LayoutDashboard, MessageSquarePlus } from 'lucide-react'

export default function Home() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">AI Post Creator</h1>
        <p className="text-xl text-muted-foreground">
          Create engaging social media content with AI
        </p>
      </div>

      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5 text-primary" />
              Create Posts
            </CardTitle>
            <CardDescription>
              Generate engaging social media posts with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Use our AI to create compelling Facebook posts and stories. Choose from different post
              types and customize to your needs.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/ai-post-creator" className="w-full">
              <Button className="w-full justify-between">
                Create Posts
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              Dashboard
            </CardTitle>
            <CardDescription>Manage your account and view your usage</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Access your dashboard to view usage statistics, manage your credits, and see your post
              history.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Credits System
            </CardTitle>
            <CardDescription>Purchase credits to create more content</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our credit system allows you to pay only for what you use. Purchase credits in bundles
              and use them to generate posts, stories, and sequences.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-md border p-3 text-center">
                <p className="text-lg font-bold">100</p>
                <p className="text-sm font-medium">Credits</p>
                <p className="text-xs text-muted-foreground">$9.99</p>
              </div>
              <div className="rounded-md border p-3 text-center">
                <p className="text-lg font-bold">250</p>
                <p className="text-sm font-medium">Credits</p>
                <p className="text-xs text-muted-foreground">$19.99</p>
              </div>
              <div className="rounded-md border p-3 text-center">
                <p className="text-lg font-bold">500</p>
                <p className="text-sm font-medium">Credits</p>
                <p className="text-xs text-muted-foreground">$34.99</p>
              </div>
              <div className="rounded-md border p-3 text-center">
                <p className="text-lg font-bold">1000</p>
                <p className="text-sm font-medium">Credits</p>
                <p className="text-xs text-muted-foreground">$59.99</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard?tab=credits" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                Manage Credits
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
