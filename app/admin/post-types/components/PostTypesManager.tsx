'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit, Trash2 } from 'lucide-react'
import PostTypeForm from './PostTypeForm'

type PostType = {
  id: string
  name: string
  description: string
  prompt: string
  variables: string[]
}

export default function PostTypesManager() {
  const [postTypes, setPostTypes] = useState<PostType[]>([
    {
      id: '1',
      name: 'Engagement Post',
      description: 'Posts designed to maximize user engagement',
      prompt:
        'Create an engaging social media post about {{topic}} that will encourage likes, comments, and shares. The tone should be {{tone}} and it should include a call to action.',
      variables: ['topic', 'tone'],
    },
    {
      id: '2',
      name: 'Promotional Post',
      description: 'Posts promoting products or services',
      prompt:
        'Create a promotional post for {{product}} highlighting its {{benefit}}. Include a compelling offer and call to action.',
      variables: ['product', 'benefit'],
    },
  ])

  const [editingPostType, setEditingPostType] = useState<PostType | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateNew = () => {
    setEditingPostType(null)
    setIsCreating(true)
  }

  const handleEdit = (postType: PostType) => {
    setEditingPostType(postType)
    setIsCreating(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post type?')) {
      setPostTypes(postTypes.filter((pt) => pt.id !== id))
    }
  }

  const handleSave = (postType: Omit<PostType, 'id'>) => {
    if (editingPostType) {
      // Update existing
      setPostTypes(
        postTypes.map((pt) =>
          pt.id === editingPostType.id ? { ...postType, id: editingPostType.id } : pt
        )
      )
    } else {
      // Create new
      const newId = Math.random().toString(36).substring(2, 9)
      setPostTypes([...postTypes, { ...postType, id: newId }])
    }
    setIsCreating(false)
    setEditingPostType(null)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingPostType(null)
  }

  return (
    <Tabs defaultValue="list">
      <div className="mb-4 flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="list">Post Types</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
        </TabsList>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Post Type
        </Button>
      </div>

      <TabsContent value="list">
        {isCreating ? (
          <Card>
            <CardHeader>
              <CardTitle>{editingPostType ? 'Edit Post Type' : 'Create New Post Type'}</CardTitle>
            </CardHeader>
            <CardContent>
              <PostTypeForm
                initialData={editingPostType || undefined}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {postTypes.map((postType) => (
              <Card key={postType.id}>
                <CardHeader>
                  <CardTitle>{postType.name}</CardTitle>
                  <CardDescription>{postType.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="mb-1 text-sm font-medium">Prompt Template:</h4>
                    <p className="rounded-md bg-muted p-3 text-sm">{postType.prompt}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Variables:</h4>
                    <div className="flex flex-wrap gap-2">
                      {postType.variables.map((variable) => (
                        <span
                          key={variable}
                          className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(postType)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(postType.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="variables">
        <Card>
          <CardHeader>
            <CardTitle>Global Variables</CardTitle>
            <CardDescription>
              Manage variables that can be used across all post types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-8 text-center text-muted-foreground">
              Variable management will be implemented in the next phase
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
