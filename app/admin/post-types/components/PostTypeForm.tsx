'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus } from 'lucide-react'

type PostType = {
  name: string
  description: string
  prompt: string
  variables: string[]
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  prompt: z.string().min(20, 'Prompt must be at least 20 characters'),
})

type PostTypeFormProps = {
  initialData?: PostType
  onSave: (data: PostType) => void
  onCancel: () => void
}

export default function PostTypeForm({ initialData, onSave, onCancel }: PostTypeFormProps) {
  const [variables, setVariables] = useState<string[]>(initialData?.variables || [])
  const [newVariable, setNewVariable] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      prompt: initialData?.prompt || '',
    },
  })

  const addVariable = () => {
    if (newVariable && !variables.includes(newVariable)) {
      setVariables([...variables, newVariable])
      setNewVariable('')
    }
  }

  const removeVariable = (variable: string) => {
    setVariables(variables.filter((v) => v !== variable))
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      ...values,
      variables,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Engagement Post" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description of this post type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Prompt Template</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Create a post about {{topic}} with a {{tone}} tone..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Use {{ variable }} syntax to define variables that will be replaced when generating
                posts
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Variables</FormLabel>
          <div className="mb-4 mt-2 flex items-center space-x-2">
            <Input
              placeholder="New variable name"
              value={newVariable}
              onChange={(e) => setNewVariable(e.target.value)}
            />
            <Button type="button" onClick={addVariable} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {variables.map((variable) => (
              <div
                key={variable}
                className="flex items-center rounded-md bg-secondary px-3 py-1 text-secondary-foreground"
              >
                <span className="mr-2 text-sm">{variable}</span>
                <button
                  type="button"
                  onClick={() => removeVariable(variable)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {variables.length === 0 && (
              <p className="text-sm text-muted-foreground">No variables added yet</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Post Type</Button>
        </div>
      </form>
    </Form>
  )
}
