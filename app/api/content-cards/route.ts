import { NextRequest, NextResponse } from 'next/server'
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

// This would be replaced with a database query in a real implementation
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

// Tenant-specific content cards - in a real implementation, this would be stored in a database
const tenantContentCards: Record<string, ContentCard[]> = {
  'tenant-1': [
    ...mockContentCards,
    {
      id: '13',
      name: 'Product Launch',
      description: 'Announce a new product or feature',
      icon: 'Sparkles',
      prompt:
        'Create an exciting product launch announcement for {product_name} highlighting its {key_features}. Build anticipation and explain how it solves customer problems.',
      isActive: true,
      category: 'Promotional',
      variables: ['product_name', 'key_features'],
    },
  ],
  'tenant-2': [
    ...mockContentCards.filter((card) => card.category !== 'Promotional'),
    {
      id: '14',
      name: 'Industry News',
      description: 'Share breaking news in your industry',
      icon: 'Newspaper',
      prompt:
        'Share the latest news about {topic} in the {industry} industry. Provide your expert analysis and explain why this matters to your audience.',
      isActive: true,
      category: 'Educational',
      variables: ['topic', 'industry'],
    },
  ],
}

export async function GET(request: NextRequest) {
  // Get tenant ID from query parameters
  const searchParams = request.nextUrl.searchParams
  const tenantId = searchParams.get('tenantId')

  // Add artificial delay to simulate network request
  await new Promise((resolve) => setTimeout(resolve, 300))

  try {
    // Return tenant-specific content cards if available, otherwise return default cards
    const contentCards =
      tenantId && tenantContentCards[tenantId] ? tenantContentCards[tenantId] : mockContentCards

    // Ensure we're returning an array
    if (!Array.isArray(contentCards)) {
      console.error('Content cards is not an array:', contentCards)
      return NextResponse.json({ contentCards: [] }, { status: 500 })
    }

    return NextResponse.json({ contentCards })
  } catch (error) {
    console.error('Error in content cards API:', error)
    return NextResponse.json({ contentCards: [] }, { status: 500 })
  }
}
