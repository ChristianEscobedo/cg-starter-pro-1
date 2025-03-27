import { Metadata } from 'next'
import PostTypesManager from './components/PostTypesManager'

export const metadata: Metadata = {
  title: 'Post Types Management',
  description: 'Create and manage post types and AI prompts',
}

export default function PostTypesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-2 text-3xl font-bold">Post Types</h1>
      <p className="mb-6 text-muted-foreground">Create and manage post types and AI prompts</p>

      <PostTypesManager />
    </div>
  )
}
