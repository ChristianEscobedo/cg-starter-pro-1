'use client'

import PostCreatorDashboard from './components/PostCreatorDashboard'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Images, Copy } from 'lucide-react'

export default function PostCreatorPage() {
  const [showSelection, setShowSelection] = useState(true)
  const [mode, setMode] = useState<'single' | 'sequence' | 'variants' | null>(null)

  const handleModeSelect = (selectedMode: 'single' | 'sequence' | 'variants') => {
    setMode(selectedMode)
    setShowSelection(false)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">AI Post Creator</h1>

      {showSelection ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:mx-auto lg:max-w-6xl">
          <Card
            className="h-full cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => handleModeSelect('single')}
          >
            <CardHeader>
              <MessageSquare className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Create Single Post</CardTitle>
              <CardDescription>Create an individual post or story</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate a single Facebook post or story with AI. Perfect for one-off content
                creation.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Create Single Post</Button>
            </CardFooter>
          </Card>

          <Card
            className="h-full cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => handleModeSelect('sequence')}
          >
            <CardHeader>
              <Images className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Create Post Sequence</CardTitle>
              <CardDescription>Create multiple connected posts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate a sequence of related posts or stories. Ideal for campaigns, storytelling,
                or content series.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Create Post Sequence</Button>
            </CardFooter>
          </Card>

          <Card
            className="h-full cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => handleModeSelect('variants')}
          >
            <CardHeader>
              <Copy className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Create Post Variants</CardTitle>
              <CardDescription>Generate multiple versions of a post</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate multiple variations of the same post to test different messaging and find
                the most effective content.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Create Post Variants</Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between">
          <PostCreatorDashboard initialMode={mode} />
          <Button
            variant="outline"
            onClick={() => setShowSelection(true)}
            className="absolute right-8 top-8"
          >
            Back to Selection
          </Button>
        </div>
      )}
    </div>
  )
}
