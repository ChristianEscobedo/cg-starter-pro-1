'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function CreateCreditPackageForm() {
  const [name, setName] = useState('')
  const [credits, setCredits] = useState(100)
  const [price, setPrice] = useState(9.99)
  const [isActive, setIsActive] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would call an API to create the package
    // For now, we'll just show a toast notification
    toast.success(`Created ${name} package with ${credits} credits for $${price}`)

    // Reset form
    setName('')
    setCredits(100)
    setPrice(9.99)
    setIsActive(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Package Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Starter Package"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="credits">Number of Credits</Label>
        <Input
          id="credits"
          type="number"
          min={1}
          value={credits}
          onChange={(e) => setCredits(parseInt(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          min={0.01}
          step={0.01}
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
        <Label htmlFor="active">Active</Label>
      </div>

      <Button type="submit" className="w-full">
        Create Package
      </Button>
    </form>
  )
}
