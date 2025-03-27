'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Coins, Plus } from 'lucide-react'
import { useCredits } from '@/lib/credits'

export default function CreditDisplay() {
  const { credits, addCredits } = useCredits()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Coins className="h-4 w-4" />
          <span className="font-bold">{credits}</span> Credits
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Purchase Credits</h4>
            <p className="text-sm text-muted-foreground">
              Add more credits to create AI-generated posts
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Card className="cursor-pointer border-2 hover:border-primary">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">100</div>
                <p className="text-sm font-medium">Credits</p>
                <p className="text-xs text-muted-foreground">$9.99</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    addCredits(100)
                    setIsOpen(false)
                  }}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>
            <Card className="cursor-pointer border-2 hover:border-primary">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">250</div>
                <p className="text-sm font-medium">Credits</p>
                <p className="text-xs text-muted-foreground">$19.99</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    addCredits(250)
                    setIsOpen(false)
                  }}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>
            <Card className="cursor-pointer border-2 hover:border-primary">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">500</div>
                <p className="text-sm font-medium">Credits</p>
                <p className="text-xs text-muted-foreground">$34.99</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    addCredits(500)
                    setIsOpen(false)
                  }}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>
            <Card className="cursor-pointer border-2 hover:border-primary">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">1000</div>
                <p className="text-sm font-medium">Credits</p>
                <p className="text-xs text-muted-foreground">$59.99</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    addCredits(1000)
                    setIsOpen(false)
                  }}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
