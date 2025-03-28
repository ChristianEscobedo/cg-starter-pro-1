'use client'

import { useState, useEffect, useRef } from 'react'
import { useContentCards } from '@/hooks/use-content-cards'
import { useWhiteLabel } from '@/components/providers/white-label-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PostCreatorForm from './PostCreatorForm'
import FacebookPostPreview from './FacebookPostPreview'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CreditCard,
  ImageIcon,
  SmilePlus,
  Sparkles,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MessageSquare,
  Send,
  Copy,
  MessageCircle,
  Upload,
  Wand2,
  X,
  Loader2,
  BookOpen,
  Bell,
  HelpCircle,
  Star,
  Calendar,
  Tag,
  Image,
  Download,
  Users,
  Lightbulb,
  Anchor,
  GraduationCap,
  Camera,
  Palette,
  Layers,
  Brush,
  Minus,
  Clock,
  Monitor,
  Box,
  ChevronDown,
} from 'lucide-react'
import { useCredits } from '@/lib/credits'
import Link from 'next/link'
import { generateCompletion } from '@/utils/ai/openai'
import { usePostState } from '@/hooks/use-post-state'

// Types
type PostItem = {
  id: string
  content: string
  imageUrl?: string
  isStory?: boolean
}

type ImageGenerationPrompt = {
  prompt: string
  style?: string
  ratio?: '1:1' | '4:3' | '16:9'
}

type PostCreatorDashboardProps = {
  initialMode?: 'single' | 'sequence' | 'variants' | null
}

type ImageStyle = {
  id: string
  label: string
  icon: React.ReactNode
  color: string
}

type AspectRatio = {
  id: '1:1' | '4:3' | '16:9' | '9:16' | '4:5' | '2:3'
  label: string
  preview: string
}

// Component
export default function PostCreatorDashboard({ initialMode = null }: PostCreatorDashboardProps) {
  // Import post state
  const {
    posts,
    currentPostIndex,
    isCreatingNew,
    selectedImage,
    setCurrentPostIndex,
    setIsCreatingNew,
    setSelectedImage,
    deletePost,
    addPost,
  } = usePostState()

  // Get white label settings
  const { settings: whiteLabelSettings } = useWhiteLabel()

  // State
  const [variantsMode, setVariantsMode] = useState<boolean>(false)
  const [postType, setPostType] = useState<string>('')
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<string>('facebook')
  const [brief, setBrief] = useState<string>('')
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false)
  const [imagePrompt, setImagePrompt] = useState<string>('')
  const [imageStyle, setImageStyle] = useState<string>('realistic')
  const [imageRatio, setImageRatio] = useState<'1:1' | '4:3' | '16:9' | '9:16' | '4:5' | '2:3'>(
    '1:1'
  )
  const [contentCardExpanded, setContentCardExpanded] = useState<boolean>(true)
  const [profileCardExpanded, setProfileCardExpanded] = useState<boolean>(false)
  const [imageCardExpanded, setImageCardExpanded] = useState<boolean>(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState('create')
  const [selectedProfile, setSelectedProfile] = useState<string>('')

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hooks
  const { credits } = useCredits()
  const { contentCards, isLoading: isLoadingContentCards } = useContentCards({
    tenantId: 'tenant-1',
  }) // In a real app, tenantId would come from auth context
  const currentPost = posts[currentPostIndex]

  // Effects
  useEffect(() => {
    if (initialMode === 'sequence') {
      setActiveTab('sequence')
      setVariantsMode(false)
    } else if (initialMode === 'variants') {
      setActiveTab('create')
      setVariantsMode(true)
    } else {
      setActiveTab('create')
      setVariantsMode(false)
    }
  }, [initialMode])

  // Handlers
  const handleGeneratePost = () => {
    if (!brief || !postType) return

    // Mock post generation
    let profileContext = ''
    if (selectedProfile) {
      profileContext = `[Using ${selectedProfile.split('_').join(' ')}] `
    }

    const mockContent = `${profileContext}${brief}\n\nThis is a generated ${postType} post. #ai #content`

    addPost({
      content: mockContent,
      isStory: false,
      imageUrl: selectedImage || undefined,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string)
          setIsImageDialogOpen(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleGenerateImage = async () => {
    if (!imagePrompt) return

    setIsGeneratingImage(true)

    try {
      // Generate image using AI
      const prompt = `Create a social media post image with the following description: ${imagePrompt}. Style: ${imageStyle}. Aspect ratio: ${imageRatio}.`

      // For demo purposes, we'll use a placeholder image from Unsplash
      // In a real implementation, you would call your AI image generation service
      const randomId = Math.floor(Math.random() * 1000)
      const placeholderImage = `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80&random=${randomId}`

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSelectedImage(placeholderImage)
      setIsImageDialogOpen(false)
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleAddNew = () => {
    setIsCreatingNew(true)
    setActiveTab('create')
  }

  const handleDelete = (id: string) => {
    deletePost(id)
  }

  const handleNext = () => {
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex((prev) => prev - 1)
    }
  }

  const resetTab = (tab: string) => {
    setActiveTab(tab)
  }

  const toggleDropdown = (dropdownId: string) => {
    // Close all other dropdowns first
    document.querySelectorAll('[id$="-dropdown"]').forEach((el) => {
      if (el.id !== dropdownId) el.classList.add('hidden')
    })
    // Toggle this dropdown
    document.getElementById(dropdownId)?.classList.toggle('hidden')
  }

  // Data for UI components
  const imageStyles: ImageStyle[] = [
    {
      id: 'realistic',
      label: 'Realistic',
      icon: <Image className="h-4 w-4" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'cartoon',
      label: 'Cartoon',
      icon: <Palette className="h-4 w-4" />,
      color: 'bg-green-50 text-green-600',
    },
    {
      id: 'abstract',
      label: 'Abstract',
      icon: <Layers className="h-4 w-4" />,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'minimalist',
      label: 'Minimalist',
      icon: <Minus className="h-4 w-4" />,
      color: 'bg-gray-50 text-gray-600',
    },
    {
      id: 'vintage',
      label: 'Vintage',
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'watercolor',
      label: 'Watercolor',
      icon: <Brush className="h-4 w-4" />,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'digital_art',
      label: 'Digital Art',
      icon: <Monitor className="h-4 w-4" />,
      color: 'bg-cyan-50 text-cyan-600',
    },
    {
      id: 'photography',
      label: 'Photography',
      icon: <Camera className="h-4 w-4" />,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      id: '3d_render',
      label: '3D Render',
      icon: <Box className="h-4 w-4" />,
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  const aspectRatios: AspectRatio[] = [
    { id: '1:1', label: 'Square (1:1)', preview: 'w-8 h-8' },
    { id: '4:3', label: 'Landscape (4:3)', preview: 'w-10 h-8' },
    { id: '16:9', label: 'Wide (16:9)', preview: 'w-12 h-7' },
    { id: '9:16', label: 'Story (9:16)', preview: 'w-6 h-10' },
    { id: '4:5', label: 'Portrait (4:5)', preview: 'w-7 h-9' },
    { id: '2:3', label: 'Tall (2:3)', preview: 'w-6 h-9' },
  ]

  const sampleImages = [
    {
      id: 'sample1',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80',
      style: 'Abstract',
    },
    {
      id: 'sample2',
      url: 'https://images.unsplash.com/photo-1682685797366-715d29e33f9d?w=400&q=80',
      style: 'Minimalist',
    },
    {
      id: 'sample3',
      url: 'https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?w=400&q=80',
      style: 'Digital Art',
    },
  ]

  // Render components
  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold" style={{ color: whiteLabelSettings.primaryColor }}>
        {whiteLabelSettings.platformName}
      </h1>
      <div className="flex items-center gap-2">
        <div className="rounded-md border border-muted bg-background px-3 py-1 text-sm">
          <span className="font-medium">{credits}</span> credits available
        </div>
        <Link href="/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            style={{
              borderColor: whiteLabelSettings.primaryColor,
              color: whiteLabelSettings.primaryColor,
            }}
          >
            <CreditCard className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )

  const renderSocialPlatformButtons = () => (
    <div className="flex space-x-2">
      {/* Facebook */}
      <div className="group relative">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => toggleDropdown('facebook-dropdown')}
        >
          <Facebook className="h-4 w-4 text-white" />
          <span>Post</span>
        </Button>
        <div
          id="facebook-dropdown"
          className="absolute left-0 z-10 mt-1 hidden w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${postType === 'feed' ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-700'}`}
              role="menuitem"
              onClick={() => {
                setPostType('feed')
                document.getElementById('facebook-dropdown')?.classList.add('hidden')
              }}
            >
              Feed Post
            </button>
            <button
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${postType === 'story' ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-700'}`}
              role="menuitem"
              onClick={() => {
                setPostType('story')
                document.getElementById('facebook-dropdown')?.classList.add('hidden')
              }}
            >
              Story Post
            </button>
          </div>
        </div>
      </div>

      {/* Instagram */}
      <div className="group relative">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          onClick={() => toggleDropdown('instagram-dropdown')}
        >
          <Instagram className="h-4 w-4 text-white" />
          <span>Post</span>
        </Button>
        <div
          id="instagram-dropdown"
          className="absolute left-0 z-10 mt-1 hidden w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${postType === 'instagram_feed' ? 'bg-pink-50 font-medium text-pink-600' : 'text-gray-700'}`}
              role="menuitem"
              onClick={() => {
                setPostType('instagram_feed')
                document.getElementById('instagram-dropdown')?.classList.add('hidden')
              }}
            >
              Feed Post
            </button>
            <button
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${postType === 'instagram_story' ? 'bg-pink-50 font-medium text-pink-600' : 'text-gray-700'}`}
              role="menuitem"
              onClick={() => {
                setPostType('instagram_story')
                document.getElementById('instagram-dropdown')?.classList.add('hidden')
              }}
            >
              Story Post
            </button>
            <button
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${postType === 'instagram_reel' ? 'bg-pink-50 font-medium text-pink-600' : 'text-gray-700'}`}
              role="menuitem"
              onClick={() => {
                setPostType('instagram_reel')
                document.getElementById('instagram-dropdown')?.classList.add('hidden')
              }}
            >
              Reel
            </button>
          </div>
        </div>
      </div>

      {/* LinkedIn */}
      <div className="group relative">
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 w-8 items-center justify-center rounded-full border-gray-300 bg-blue-600 p-0 text-white hover:bg-blue-700"
          onClick={() => toggleDropdown('linkedin-dropdown')}
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <div
          id="linkedin-dropdown"
          className="absolute left-0 z-10 mt-1 hidden w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${postType === 'linkedin_post' ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-700'}`}
              role="menuitem"
              onClick={() => {
                setPostType('linkedin_post')
                document.getElementById('linkedin-dropdown')?.classList.add('hidden')
              }}
            >
              LinkedIn Post
            </button>
          </div>
        </div>
      </div>

      {/* Twitter */}
      <div className="group relative">
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 w-8 items-center justify-center rounded-full border-gray-300 bg-black p-0 text-white hover:bg-gray-800"
          onClick={() => toggleDropdown('twitter-dropdown')}
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <div
          id="twitter-dropdown"
          className="absolute left-0 z-10 mt-1 hidden w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${postType === 'twitter_post' ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-700'}`}
              role="menuitem"
              onClick={() => {
                setPostType('twitter_post')
                document.getElementById('twitter-dropdown')?.classList.add('hidden')
              }}
            >
              Tweet
            </button>
          </div>
        </div>
      </div>

      {/* Threads */}
      <div className="group relative">
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 w-8 items-center justify-center rounded-full border-gray-300 bg-black p-0 text-white hover:bg-gray-800"
          onClick={() => toggleDropdown('threads-dropdown')}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        <div
          id="threads-dropdown"
          className="absolute left-0 z-10 mt-1 hidden w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${postType === 'threads_post' ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-700'}`}
              role="menuitem"
              onClick={() => {
                setPostType('threads_post')
                document.getElementById('threads-dropdown')?.classList.add('hidden')
              }}
            >
              Thread
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContentTypeSelector = () => (
    <Collapsible
      open={contentCardExpanded}
      onOpenChange={setContentCardExpanded}
      className="w-full rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left">
        <div className="flex items-center">
          <div
            className="mr-3 rounded-full p-2"
            style={{
              backgroundColor: `${whiteLabelSettings.secondaryColor}40`,
              color: whiteLabelSettings.primaryColor,
            }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Select Content Type</h3>
            <p className="text-xs text-gray-500">
              {postType
                ? `Selected: ${postType.charAt(0).toUpperCase() + postType.slice(1).replace('_', ' ')}`
                : 'Choose the type of content to generate'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform ${contentCardExpanded ? 'rotate-180' : ''}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {isLoadingContentCards ? (
            <div className="col-span-4 flex items-center justify-center py-8">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-gray-400" />
              <span className="text-sm text-gray-500">Loading content types...</span>
            </div>
          ) : false ? (
            <div className="col-span-4 rounded-md bg-red-50 p-4 text-center">
              <p className="text-sm text-red-600">Error loading content types</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : contentCards && Array.isArray(contentCards) && contentCards.length > 0 ? (
            contentCards.map((type) => (
              <div
                key={type.id}
                onClick={() => setPostType(type.id)}
                className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border p-3 transition-all hover:shadow-md"
                style={{
                  borderColor: postType === type.id ? whiteLabelSettings.primaryColor : '#e5e7eb',
                  backgroundColor:
                    postType === type.id ? `${whiteLabelSettings.secondaryColor}20` : '',
                }}
              >
                <div
                  className="mb-1 rounded-full p-2"
                  style={{
                    backgroundColor:
                      postType === type.id ? `${whiteLabelSettings.secondaryColor}40` : '#f3f4f6',
                    color: postType === type.id ? whiteLabelSettings.primaryColor : '#6b7280',
                  }}
                >
                  {type.icon}
                </div>
                <span className="text-sm font-medium">{type.label}</span>
                <div className="absolute -bottom-1 left-0 right-0 top-0 z-10 hidden rounded-lg bg-white p-2 shadow-lg group-hover:block">
                  <div className="flex h-full flex-col items-center justify-between">
                    <div className="text-center">
                      <div
                        className="mx-auto mb-2 rounded-full p-2"
                        style={{
                          backgroundColor:
                            postType === type.id
                              ? `${whiteLabelSettings.secondaryColor}40`
                              : `${whiteLabelSettings.secondaryColor}20`,
                          color: whiteLabelSettings.primaryColor,
                        }}
                      >
                        {type.icon}
                      </div>
                      <h4 className="mb-1 text-sm font-semibold">{type.label}</h4>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 w-full text-white"
                      style={{
                        backgroundColor: whiteLabelSettings.primaryColor,
                        ':hover': { backgroundColor: whiteLabelSettings.secondaryColor },
                      }}
                      onClick={() => setPostType(type.id)}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 rounded-md bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">No content types available</p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )

  const renderBriefInput = () => (
    <>
      <label className="mb-2 block text-sm font-medium text-gray-700">What's on Your Mind?</label>
      <textarea
        className="w-full resize-none rounded-md border border-gray-300 p-3 text-lg placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Enter your brief description here..."
        rows={5}
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
      />
      {variantsMode && (
        <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-3">
          <h3 className="mb-1 font-medium text-blue-800">Variants Mode</h3>
          <p className="text-sm text-blue-700">
            You're in variants mode. When you submit the form, multiple variations of your post will
            be generated.
          </p>
        </div>
      )}
    </>
  )

  const renderSelectedImage = () => {
    if (!selectedImage) return null

    return (
      <div className="relative mt-4">
        <div className="relative overflow-hidden rounded-lg border border-gray-200">
          <img
            src={selectedImage}
            alt="Selected image"
            className="h-auto max-h-[200px] w-full object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const renderImageDialog = () => (
    <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-500">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <ImageIcon className="h-5 w-5" />
          </span>
          <span>Add Media</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex flex-col gap-2 p-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-gray-500" />
              <span>Upload Image</span>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            <Button
              variant="outline"
              className="flex flex-col gap-2 p-6"
              onClick={() => {
                setImagePrompt(brief || '')
              }}
            >
              <Wand2 className="h-8 w-8" style={{ color: whiteLabelSettings.primaryColor }} />
              <span>AI Generate</span>
            </Button>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Image Style</label>
            <div className="grid grid-cols-3 gap-2">
              {imageStyles.map((style) => (
                <div
                  key={style.id}
                  onClick={() => setImageStyle(style.id)}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-md border p-2 transition-all hover:shadow-md"
                  style={{
                    borderColor:
                      imageStyle === style.id ? whiteLabelSettings.primaryColor : '#e5e7eb',
                    backgroundColor:
                      imageStyle === style.id ? `${whiteLabelSettings.secondaryColor}20` : '',
                  }}
                >
                  <div
                    className="mb-1 rounded-full p-1.5"
                    style={{
                      backgroundColor:
                        imageStyle === style.id
                          ? `${whiteLabelSettings.secondaryColor}40`
                          : style.color.split(' ')[0],
                      color:
                        imageStyle === style.id
                          ? whiteLabelSettings.primaryColor
                          : style.color.split(' ')[1],
                    }}
                  >
                    {style.icon}
                  </div>
                  <span className="text-xs font-medium">{style.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image Prompt</label>
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              rows={3}
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map((ratio) => (
                <div
                  key={ratio.id}
                  onClick={() => setImageRatio(ratio.id)}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-md border p-2 transition-all hover:shadow-md"
                  style={{
                    borderColor:
                      imageRatio === ratio.id ? whiteLabelSettings.primaryColor : '#e5e7eb',
                    backgroundColor:
                      imageRatio === ratio.id ? `${whiteLabelSettings.secondaryColor}20` : '',
                  }}
                >
                  <div className="mb-2 flex items-center justify-center">
                    <div
                      className={`${ratio.preview} rounded bg-gradient-to-br`}
                      style={{
                        background:
                          imageRatio === ratio.id
                            ? `linear-gradient(to bottom right, ${whiteLabelSettings.secondaryColor}, ${whiteLabelSettings.primaryColor})`
                            : 'linear-gradient(to bottom right, #d1d5db, #6b7280)',
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium">{ratio.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Collapsible
              open={imageCardExpanded}
              onOpenChange={setImageCardExpanded}
              className="w-full rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left">
                <div className="flex items-center">
                  <div
                    className="mr-3 rounded-full p-2"
                    style={{
                      backgroundColor: `${whiteLabelSettings.secondaryColor}40`,
                      color: whiteLabelSettings.primaryColor,
                    }}
                  >
                    <Image className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Image Output Preview</h3>
                    <p className="text-xs text-gray-500">
                      {selectedImage ? 'Image ready to use' : 'No image generated yet'}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${imageCardExpanded ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                {renderImagePreview()}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {sampleImages.map((sample) => (
                    <div
                      key={sample.id}
                      onClick={() => setSelectedImage(sample.url)}
                      className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-md"
                      style={{
                        borderColor:
                          selectedImage === sample.url ? whiteLabelSettings.primaryColor : '',
                        ':hover': { borderColor: whiteLabelSettings.secondaryColor },
                      }}
                    >
                      <img
                        src={sample.url}
                        alt={sample.style}
                        className="h-20 w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                        <p className="text-xs text-white">{sample.style}</p>
                      </div>
                      <div
                        className="absolute left-0 top-0 h-full w-full opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ backgroundColor: `${whiteLabelSettings.primaryColor}20` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Button
              onClick={handleGenerateImage}
              disabled={!imagePrompt || isGeneratingImage}
              className="w-full text-white"
              style={{
                backgroundColor: whiteLabelSettings.primaryColor,
                ':hover': { backgroundColor: whiteLabelSettings.secondaryColor },
              }}
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const renderImagePreview = () => {
    if (isGeneratingImage) {
      return (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-gray-100">
          <div className="text-center">
            <Loader2
              className="mx-auto mb-2 h-8 w-8 animate-spin"
              style={{ color: whiteLabelSettings.primaryColor }}
            />
            <p className="text-sm text-gray-500">Generating your image...</p>
          </div>
        </div>
      )
    }

    if (selectedImage) {
      return (
        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-3">
            <div className="rounded-md bg-black/30 px-2 py-1 text-xs text-white backdrop-blur-sm">
              {imageStyle.charAt(0).toUpperCase() + imageStyle.slice(1).replace('_', ' ')}
            </div>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                onClick={() => {
                  // Create a temporary anchor element
                  const a = document.createElement('a')
                  a.href = selectedImage
                  a.download = `ai-generated-image-${Date.now()}.jpg`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <img
            src={selectedImage}
            alt="Generated image"
            className="h-48 w-full rounded-lg object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
            <div className="rounded-md bg-black/30 px-2 py-1 text-xs text-white backdrop-blur-sm">
              {imageRatio}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-gray-100">
        <div className="text-center">
          <Image className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500">No image generated yet</p>
          <p className="mt-1 text-xs text-gray-400">Enter a prompt and click Generate Image</p>
        </div>
      </div>
    )
  }

  const renderCreateTabContent = () => {
    if (!isCreatingNew) {
      return (
        <div className="space-y-6">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 text-lg font-medium">Post Added to Sequence</h3>
            <p className="text-sm text-muted-foreground">
              Your post has been added to the sequence. You can view and navigate through your posts
              in the Post Sequence tab.
            </p>
          </div>
          <Button onClick={handleAddNew} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create Another Post
          </Button>
        </div>
      )
    }

    return (
      <>
        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <div className="mb-4">{renderContentTypeSelector()}</div>
          {renderBriefInput()}
          {renderSelectedImage()}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-4">
              {renderImageDialog()}
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-500">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <SmilePlus className="h-5 w-5" />
                </span>
                <span>Emoji</span>
              </Button>
            </div>
            <Button
              onClick={handleGeneratePost}
              className="rounded-full px-6 text-white"
              style={{
                backgroundColor: whiteLabelSettings.primaryColor,
                ':hover': { backgroundColor: whiteLabelSettings.secondaryColor },
              }}
              disabled={!brief || !postType || isLoadingContentCards}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Description
            </Button>
          </div>
        </div>
      </>
    )
  }

  const renderSequenceTabContent = () => {
    if (posts.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No posts in your sequence yet</p>
          <Button
            onClick={() => {
              setIsCreatingNew(true)
              resetTab('create')
            }}
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Post
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your Post Sequence</h3>
          <span className="text-sm text-muted-foreground">
            {currentPostIndex + 1} of {posts.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {posts.map((post, index) => (
            <Button
              key={post.id}
              variant={index === currentPostIndex ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPostIndex(index)}
              style={
                index === currentPostIndex
                  ? { backgroundColor: whiteLabelSettings.primaryColor }
                  : {}
              }
            >
              {index + 1}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(currentPost.id)}
            disabled={posts.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Current
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentPostIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentPostIndex === posts.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderHistoryTabContent = () => (
    <div className="py-8 text-center">
      <p className="text-muted-foreground">Your post history will appear here</p>
    </div>
  )

  const renderPreviewPlatformButtons = () => (
    <div className="flex space-x-2">
      {/* Facebook */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className={`flex h-8 w-8 items-center justify-center rounded-full border-gray-300 bg-blue-500 p-0 text-white hover:bg-blue-600 ${currentPost?.isStory ? 'ring-2 ring-blue-300' : ''}`}
          onClick={() => toggleDropdown('preview-facebook-dropdown')}
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <div
          id="preview-facebook-dropdown"
          className="absolute left-0 z-10 mt-1 hidden w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => {
                if (currentPost) {
                  const updatedPost = { ...currentPost, isStory: false }
                  // Use the global state to update the post
                  const newPosts = posts.map((p) => (p.id === currentPost.id ? updatedPost : p))
                  // We need to update the posts in the global state
                  // This would require adding an updatePost method to the usePostState hook
                  // For now, we'll just close the dropdown
                  document.getElementById('preview-facebook-dropdown')?.classList.add('hidden')
                }
              }}
            >
              Feed Post
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => {
                if (currentPost) {
                  const updatedPost = { ...currentPost, isStory: true }
                  // Use the global state to update the post
                  const newPosts = posts.map((p) => (p.id === currentPost.id ? updatedPost : p))
                  // We need to update the posts in the global state
                  // This would require adding an updatePost method to the usePostState hook
                  // For now, we'll just close the dropdown
                  document.getElementById('preview-facebook-dropdown')?.classList.add('hidden')
                }
              }}
            >
              Story Post
            </button>
          </div>
        </div>
      </div>

      {/* Instagram */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 w-8 items-center justify-center rounded-full border-gray-300 bg-gradient-to-r from-purple-500 to-pink-500 p-0 text-white hover:from-purple-600 hover:to-pink-600"
          onClick={() => toggleDropdown('preview-instagram-dropdown')}
        >
          <Instagram className="h-4 w-4" />
        </Button>
        <div
          id="preview-instagram-dropdown"
          className="absolute left-0 z-10 mt-1 hidden w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Feed Post
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Story Post
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Reel
            </button>
          </div>
        </div>
      </div>

      {/* LinkedIn */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 w-8 items-center justify-center rounded-full border-gray-300 bg-blue-600 p-0 text-white hover:bg-blue-700"
          onClick={() => toggleDropdown('preview-linkedin-dropdown')}
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <div
          id="preview-linkedin-dropdown"
          className="absolute left-0 z-10 mt-1 hidden w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              LinkedIn Post
            </button>
          </div>
        </div>
      </div>

      {/* Twitter */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 w-8 items-center justify-center rounded-full border-gray-300 bg-black p-0 text-white hover:bg-gray-800"
          onClick={() => toggleDropdown('preview-twitter-dropdown')}
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <div
          id="preview-twitter-dropdown"
          className="absolute left-0 z-10 mt-1 hidden w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPreviewContent = () => {
    if (posts.length === 0) {
      return (
        <div className="rounded-md border border-dashed py-16 text-center">
          <p className="text-muted-foreground">Your generated content will appear here</p>
        </div>
      )
    }

    return (
      <div className="w-full">
        <FacebookPostPreview
          content={currentPost.content}
          imageUrl={currentPost.imageUrl}
          isStory={currentPost.isStory}
          variants={posts}
          currentVariantIndex={currentPostIndex}
          onSelectVariant={setCurrentPostIndex}
        />
      </div>
    )
  }

  // Main render
  return (
    <div className="space-y-4">
      {renderHeader()}

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Creator */}
        <div className="w-full">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create New Post</h2>
              {renderSocialPlatformButtons()}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="hidden">
                <TabsTrigger value="create">Create Post</TabsTrigger>
                <TabsTrigger value="sequence">Post Sequence</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="w-full">
                {renderCreateTabContent()}
              </TabsContent>

              <TabsContent value="sequence">{renderSequenceTabContent()}</TabsContent>

              <TabsContent value="history">{renderHistoryTabContent()}</TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="w-full">
          <Card className="bg-gray-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Preview</h2>
              {renderPreviewPlatformButtons()}
            </div>
            {renderPreviewContent()}
          </Card>
        </div>
      </div>
    </div>
  )
}
