'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

export default function CreateContentCardForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [variables, setVariables] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!name || !description || !icon || !prompt || !category) {
      toast.error('Please fill in all required fields')
      return
    }

    // In a real app, this would call an API to create the content card
    toast.success(`Created ${name} content card`)

    // Reset form
    setName('')
    setDescription('')
    setIcon('')
    setPrompt('')
    setCategory('')
    setIsActive(true)
    setVariables([])
  }

  const addVariable = () => {
    setVariables([...variables, ''])
  }

  const removeVariable = (index: number) => {
    const newVariables = [...variables]
    newVariables.splice(index, 1)
    setVariables(newVariables)
  }

  const handleVariableChange = (index: number, value: string) => {
    const newVariables = [...variables]
    newVariables[index] = value
    setVariables(newVariables)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Card Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Story"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Engagement"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the card"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon Name</Label>
        <Input
          id="icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="e.g. BookOpen (from Lucide icons)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">AI Prompt Template</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter the prompt template with {variables}"
          rows={4}
          required
        />
        <p className="text-xs text-muted-foreground">
          Use {'{variable}'} syntax for dynamic variables that will be replaced with user input
        </p>
      </div>

      <div className="space-y-2">
        <Label>Variables</Label>
        {variables.map((variable, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={variable}
              onChange={(e) => handleVariableChange(index, e.target.value)}
              placeholder="Variable name"
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeVariable(index)}
              className="shrink-0"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addVariable} className="mt-2" type="button">
          Add Variable
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
        <Label htmlFor="active">Active</Label>
      </div>

      <Button type="submit" className="w-full">
        Create Content Card
      </Button>
    </form>
  )
}
