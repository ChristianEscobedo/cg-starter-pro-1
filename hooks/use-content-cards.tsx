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
} from 'lucide-react'

// This would be replaced with an API call in a real implementation
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
    isActive: true,
    category: 'Engagement',
    variables: ['topic', 'audience'],
  },
  {
    id: '6',
    name: 'Promotional',
    description: 'Content that promotes products or services',
    icon: 'Sparkles',
    prompt:
      'Create a promotional post for {product} highlighting its {benefits}. The post should be persuasive without being too salesy.',
    isActive: true,
    category: 'Conversion',
    variables: ['product', 'benefits'],
  },
  {
    id: '7',
    name: 'Educational',
    description: 'Informative content that teaches your audience',
    icon: 'GraduationCap',
    prompt:
      'Create an educational post about {topic} that provides valuable information to {audience}. Include key facts, insights, and actionable takeaways.',
    isActive: true,
    category: 'Educational',
    variables: ['topic', 'audience'],
  },
  {
    id: '8',
    name: 'Announcement',
    description: 'Share news and updates about your business',
    icon: 'Bell',
    prompt:
      'Create an announcement post about {news} for {audience}. The post should generate excitement and clearly communicate the key details.',
    isActive: true,
    category: 'Informational',
    variables: ['news', 'audience'],
  },
  {
    id: '9',
    name: 'Testimonial',
    description: 'Showcase positive feedback from customers',
    icon: 'Star',
    prompt:
      'Create a testimonial post highlighting how {product} helped {customer} achieve {result}. The post should be authentic and focus on the specific benefits experienced.',
    isActive: true,
    category: 'Social Proof',
    variables: ['product', 'customer', 'result'],
  },
  {
    id: '10',
    name: 'Event',
    description: 'Promote upcoming events or webinars',
    icon: 'Calendar',
    prompt:
      'Create a post promoting an upcoming {event_type} about {topic}. Include key details like date, time, and what attendees will learn or experience.',
    isActive: true,
    category: 'Promotional',
    variables: ['event_type', 'topic'],
  },
  {
    id: '11',
    name: 'Special Offer',
    description: 'Highlight discounts or limited-time offers',
    icon: 'Tag',
    prompt:
      'Create a post announcing a special offer of {discount} for {product}. Emphasize the limited-time nature and the value customers will receive.',
    isActive: true,
    category: 'Promotional',
    variables: ['discount', 'product'],
  },
  {
    id: '12',
    name: 'Behind the Scenes',
    description: 'Show your audience how your business works',
    icon: 'Camera',
    prompt:
      'Create a behind-the-scenes post showing {process} at {company}. The post should feel authentic and give followers an exclusive look at your business.',
    isActive: true,
    category: 'Engagement',
    variables: ['process', 'company'],
  },
]

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

export function useContentCards() {
  const [contentCards, setContentCards] = useState<ContentCardWithIcon[]>([])

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchContentCards = () => {
      // Filter to only active cards and transform to the format expected by the UI
      const activeCards = mockContentCards
        .filter((card) => card.isActive)
        .map((card) => ({
          id: card.id,
          label: card.name,
          description: card.description,
          icon: getIconComponent(card.icon),
          prompt: card.prompt,
          variables: card.variables,
        }))

      setContentCards(activeCards)
    }

    fetchContentCards()
  }, [])

  return contentCards
}
