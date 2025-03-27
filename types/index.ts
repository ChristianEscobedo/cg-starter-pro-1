export type PostType = {
  id: string
  name: string
  description: string
  prompt: string
  variables: string[]
}

export type GeneratedPost = {
  id: string
  content: string
  imageUrl?: string
  postTypeId: string
  createdAt: string
  publishedAt?: string
}

export type WhiteLabelSettings = {
  platformName: string
  primaryColor: string
  secondaryColor: string
  logoUrl?: string
}

export type Tenant = {
  id: string
  name: string
  subdomain: string
  whiteLabelSettings: WhiteLabelSettings
  createdAt: string
  ownerId: string
}

export type User = {
  id: string
  name: string
  email: string
  tenantId: string
  role: 'admin' | 'user'
  createdAt: string
  credits?: number
}

export type AIProvider = 'openai' | 'claude' | 'deepseek' | 'vercel'

export type AISettings = {
  provider: AIProvider
  apiKey?: string
  model: string
  temperature: number
  maxTokens: number
}

export type ImageSettings = {
  provider: 'fal'
  apiKey?: string
  model: string
  width: number
  height: number
}

export type CreditPackage = {
  id: string
  name: string
  credits: number
  price: number
  isActive: boolean
  createdAt: string
}

export type CreditTransaction = {
  id: string
  userId: string
  amount: number
  description: string
  date: Date
  type: 'purchase' | 'usage' | 'admin'
}
