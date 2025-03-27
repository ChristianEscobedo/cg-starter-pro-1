'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Edit, Eye, Trash2, Plus } from 'lucide-react'

interface ContentCard {
  id: string
  name: string
  description: string
  icon: string
  prompt: string
  isActive: boolean
  category: string
  variables?: string[]
}

// Mock data - would be replaced with real data from API
const mockContentCards: ContentCard[] = [
  {
    id: '1',
    name: 'Story',
    description: 'Narrative content that tells a compelling story',
    icon: 'BookOpen',
    prompt:
      'Create a compelling story about {topic} that resonates with {audience}. The story should have a clear beginning, middle, and end, with an emotional hook that captures attention.',
    isActive: true,
    category: 'Engagement',
    variables: ['topic', 'audience'],
  },
  {
    id: '2',
    name: 'Lead Generation',
    description: 'Content designed to capture potential customer information',
    icon: 'Users',
    prompt:
      'Create a lead generation post for {product} targeting {audience}. Include a clear call-to-action and highlight the value proposition that would make someone want to sign up or learn more.',
    isActive: true,
    category: 'Conversion',
    variables: ['product', 'audience'],
  },
  {
    id: '3',
    name: 'Insight',
    description: 'Share valuable industry insights and analysis',
    icon: 'Lightbulb',
    prompt:
      'Share an insightful analysis about {topic} in the {industry} industry. Include data points, trends, and a unique perspective that positions the brand as a thought leader.',
    isActive: true,
    category: 'Educational',
    variables: ['topic', 'industry'],
  },
  {
    id: '4',
    name: 'Engagement Question',
    description: 'Questions that encourage audience interaction',
    icon: 'MessageSquare',
    prompt:
      'Create an engaging question about {topic} that will encourage {audience} to comment and share their thoughts. The question should be open-ended and relevant to current trends.',
    isActive: true,
    category: 'Engagement',
    variables: ['topic', 'audience'],
  },
  {
    id: '5',
    name: 'Hook',
    description: 'Attention-grabbing opening to capture interest',
    icon: 'Anchor',
    prompt:
      'Create a powerful hook about {topic} that will immediately grab the attention of {audience}. The hook should be concise, intriguing, and make the reader want to learn more.',
    isActive: false,
    category: 'Engagement',
    variables: ['topic', 'audience'],
  },
]

export default function ContentCardsList() {
  const [contentCards, setContentCards] = useState<ContentCard[]>(mockContentCards)
  const [selectedCard, setSelectedCard] = useState<ContentCard | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState<ContentCard>({
    id: '',
    name: '',
    description: '',
    icon: '',
    prompt: '',
    isActive: true,
    category: '',
    variables: [],
  })

  const toggleCardStatus = (id: string) => {
    setContentCards(
      contentCards.map((card) => (card.id === id ? { ...card, isActive: !card.isActive } : card))
    )
    toast.success(`Card status updated`)
  }

  const deleteCard = () => {
    if (selectedCard) {
      setContentCards(contentCards.filter((card) => card.id !== selectedCard.id))
      setDeleteDialogOpen(false)
      setSelectedCard(null)
      toast.success(`Card deleted`)
    }
  }

  const handleEdit = (card: ContentCard) => {
    setSelectedCard(card)
    setEditForm(card)
    setEditDialogOpen(true)
  }

  const handlePreview = (card: ContentCard) => {
    setSelectedCard(card)
    setPreviewDialogOpen(true)
  }

  const saveEdit = () => {
    setContentCards(contentCards.map((card) => (card.id === editForm.id ? editForm : card)))
    setEditDialogOpen(false)
    toast.success(`Card updated`)
  }

  const handleVariableChange = (index: number, value: string) => {
    const newVariables = [...(editForm.variables || [])]
    newVariables[index] = value
    setEditForm({ ...editForm, variables: newVariables })
  }

  const addVariable = () => {
    setEditForm({
      ...editForm,
      variables: [...(editForm.variables || []), ''],
    })
  }

  const removeVariable = (index: number) => {
    const newVariables = [...(editForm.variables || [])]
    newVariables.splice(index, 1)
    setEditForm({ ...editForm, variables: newVariables })
  }

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-semibold">Content Cards</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Content Card</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon
                </Label>
                <Input
                  id="icon"
                  value={editForm.icon}
                  onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prompt" className="text-right">
                  Prompt
                </Label>
                <Textarea
                  id="prompt"
                  value={editForm.prompt}
                  onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="isActive"
                    checked={editForm.isActive}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Variables</Label>
                <div className="col-span-3 space-y-2">
                  {editForm.variables?.map((variable, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={variable}
                        onChange={(e) => handleVariableChange(index, e.target.value)}
                        placeholder="Variable name"
                      />
                      <Button variant="outline" size="icon" onClick={() => removeVariable(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addVariable}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variable
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveEdit}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contentCards.map((card) => (
            <TableRow key={card.id}>
              <TableCell className="font-medium">{card.name}</TableCell>
              <TableCell>{card.description}</TableCell>
              <TableCell>
                <Badge variant="outline">{card.category}</Badge>
              </TableCell>
              <TableCell>
                <Switch checked={card.isActive} onCheckedChange={() => toggleCardStatus(card.id)} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => handlePreview(card)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleEdit(card)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedCard(card)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the content card.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCard}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCard?.name} Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Prompt:</h3>
              <p className="mt-1 text-sm">{selectedCard?.prompt}</p>
            </div>
            <div>
              <h3 className="font-medium">Variables:</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {selectedCard?.variables?.map((variable) => (
                  <Badge key={variable} variant="secondary">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
