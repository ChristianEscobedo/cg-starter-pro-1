'use client'

import { useState, useEffect } from 'react'
import { ContentCard } from '@/types/content-cards'
import {
  BookOpen,
  Users,
  Lightbulb,
  MessageSquare,
  Anchor,
  Sparkles,
  GraduationCap,
  Bell,
  Star,
  Calendar,
  Tag,
  Camera,
  Newspaper,
} from 'lucide-react'

// Map icon strings to actual Lucide icon components
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    BookOpen: <BookOpen className="h-5 w-5" />,
    Users: <Users className="h-5 w-5" />,
    Lightbulb: <Lightbulb className="h-5 w-5" />,
    MessageSquare: <MessageSquare className="h-5 w-5" />,
    Anchor: <Anchor className="h-5 w-5" />,
    Sparkles: <Sparkles className="h-5 w-5" />,
    GraduationCap: <GraduationCap className="h-5 w-5" />,
    Bell: <Bell className="h-5 w-5" />,
    Star: <Star className="h-5 w-5" />,
    Calendar: <Calendar className="h-5 w-5" />,
    Tag: <Tag className="h-5 w-5" />,
    Camera: <Camera className="h-5 w-5" />,
    Newspaper: <Newspaper className="h-5 w-5" />,
  }

  return iconMap[iconName] || <MessageSquare className="h-5 w-5" />
}

type ContentCardWithIcon = {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  prompt?: string
  variables?: string[]
}

type UseContentCardsOptions = {
  tenantId?: string
}

export function useContentCards(options?: UseContentCardsOptions) {
  const { tenantId } = options || {}
  const [contentCards, setContentCards] = useState<ContentCardWithIcon[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContentCards = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch content cards from the API
        const url = `/api/content-cards${tenantId ? `?tenantId=${tenantId}` : ''}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch content cards: ${response.status}`)
        }

        const data = await response.json()

        // Ensure contentCards is an array before processing
        if (!data.contentCards || !Array.isArray(data.contentCards)) {
          console.error('Invalid content cards data:', data)
          throw new Error('Content cards data is not in the expected format')
        }

        // Filter to only active cards and transform to the format expected by the UI
        const activeCards = data.contentCards
          .filter((card: ContentCard) => card.isActive)
          .map((card: ContentCard) => ({
            id: card.id,
            label: card.name,
            description: card.description,
            icon: getIconComponent(card.icon),
            prompt: card.prompt,
            variables: card.variables,
          }))

        setContentCards(activeCards)
      } catch (err) {
        console.error('Error fetching content cards:', err)
        setError('Failed to load content cards')
        // Fallback to empty array
        setContentCards([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchContentCards()
  }, [tenantId])

  return { contentCards, isLoading, error }
}
