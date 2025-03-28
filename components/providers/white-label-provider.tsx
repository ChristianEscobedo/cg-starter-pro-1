'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { WhiteLabelSettings } from '@/types/index'

type WhiteLabelContextType = {
  settings: WhiteLabelSettings
  isLoading: boolean
  error: string | null
  updateSettings: (settings: Partial<WhiteLabelSettings>) => void
}

const defaultSettings: WhiteLabelSettings = {
  platformName: 'AI Post Creator',
  primaryColor: '#ec4899', // Pink-500
  secondaryColor: '#f9a8d4', // Pink-300
  logoUrl: undefined,
}

const WhiteLabelContext = createContext<WhiteLabelContextType>({
  settings: defaultSettings,
  isLoading: false,
  error: null,
  updateSettings: () => {},
})

export const useWhiteLabel = () => useContext(WhiteLabelContext)

type WhiteLabelProviderProps = {
  children: ReactNode
  initialSettings?: Partial<WhiteLabelSettings>
  tenantId?: string
}

export function WhiteLabelProvider({
  children,
  initialSettings = {},
  tenantId,
}: WhiteLabelProviderProps) {
  const [settings, setSettings] = useState<WhiteLabelSettings>({
    ...defaultSettings,
    ...initialSettings,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTenantSettings = async () => {
      if (!tenantId) return

      setIsLoading(true)
      setError(null)

      try {
        // In a real implementation, this would be an API call to fetch tenant settings
        // For now, we'll simulate with a timeout
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock tenant settings - in a real app, this would come from the API
        const mockTenantSettings = {
          platformName: `${tenantId}'s Content Creator`,
          primaryColor: '#3b82f6', // Blue-500
          secondaryColor: '#93c5fd', // Blue-300
          logoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + tenantId,
        }

        setSettings((prev) => ({
          ...prev,
          ...mockTenantSettings,
        }))
      } catch (err) {
        console.error('Error fetching tenant settings:', err)
        setError('Failed to load tenant settings')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTenantSettings()
  }, [tenantId])

  const updateSettings = (newSettings: Partial<WhiteLabelSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }))
  }

  // Apply CSS variables for the theme colors
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor)
      document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor)
    }
  }, [settings.primaryColor, settings.secondaryColor])

  return (
    <WhiteLabelContext.Provider value={{ settings, isLoading, error, updateSettings }}>
      {children}
    </WhiteLabelContext.Provider>
  )
}
