'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2, Sparkles, Image as ImageIcon, Wand2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useContentCards } from '@/hooks/use-content-cards'
import { useWhiteLabel } from '@/components/providers/white-label-provider'

const formSchema = z.object({
  brief: z.string().min(10, 'Brief must be at least 10 characters'),
  postType: z.string().min(1, 'Please select a post type'),
  profile: z.string().optional(),
  includeImage: z.boolean().default(false),
  imageModel: z.string().optional(),
  imagePrompt: z.string().optional(),
  imageStyle: z.string().optional(),
  postFormat: z.enum(['regular', 'story']).default('regular'),
})

type PostCreatorFormProps = {
  generateVariants?: boolean
  // Removed onPostGenerated prop as we're using global state instead
}

type TextOverlaySettings = {
  text: string
  position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  fontFamily: string
  fontSize: string
  color: string
  backgroundColor: string
  padding: string
  isVisible: boolean
}

type AnimationStyle = 'none' | 'fade-in' | 'slide-up' | 'pulse' | 'bounce'

type ColorBlockStyle = {
  enabled: boolean
  backgroundColor: string
  textColor: string
  borderColor?: string
}

type ImageStyle = {
  id: string
  name: string
  description: string
  example: string
}

import { usePostState } from '@/hooks/use-post-state'

export default function PostCreatorForm({ generateVariants = false }: PostCreatorFormProps) {
  const { addPost, selectedImage } = usePostState()
  const { settings: whiteLabelSettings } = useWhiteLabel()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [imageVariations, setImageVariations] = useState<string[]>([])
  const [selectedVariation, setSelectedVariation] = useState<number>(0)
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false)
  const [textOverlay, setTextOverlay] = useState<TextOverlaySettings>({
    text: '',
    position: 'center',
    fontFamily: 'Arial',
    fontSize: '24px',
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '8px',
    isVisible: false,
  })
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>('none')
  const [colorBlockStyle, setColorBlockStyle] = useState<ColorBlockStyle>({
    enabled: false,
    backgroundColor: '#f0f2f5',
    textColor: '#1c1e21',
    borderColor: '#dddfe2',
  })
  const { contentCards, isLoading: isLoadingContentCards } = useContentCards({
    tenantId: 'tenant-1',
  }) // In a real app, tenantId would come from auth context

  const imageStyles: ImageStyle[] = [
    {
      id: 'photorealistic',
      name: 'Photorealistic',
      description: 'Highly detailed and realistic images',
      example: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=500&q=80',
    },
    {
      id: 'cartoon',
      name: 'Cartoon',
      description: 'Stylized cartoon illustrations',
      example: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&q=80',
    },
    {
      id: 'watercolor',
      name: 'Watercolor',
      description: 'Soft watercolor painting style',
      example: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80',
    },
    {
      id: 'anime',
      name: 'Anime',
      description: 'Japanese anime illustration style',
      example: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?w=500&q=80',
    },
    {
      id: 'digital-art',
      name: 'Digital Art',
      description: 'Modern digital art style',
      example: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80',
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Clean, simple designs with minimal elements',
      example: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500&q=80',
    },
  ]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brief: '',
      postType: '',
      profile: '',
      includeImage: false,
      imageModel: 'ideogram',
      imagePrompt: '',
      imageStyle: '',
      postFormat: 'regular',
    },
  })

  const includeImage = form.watch('includeImage')
  const postFormat = form.watch('postFormat')
  const postType = form.watch('postType')
  const profile = form.watch('profile')

  // Find the selected content card
  const selectedCard = contentCards.find((card) => card.id === postType)

  // Reset variables when post type changes
  useEffect(() => {
    if (selectedCard?.variables) {
      const initialVariables: Record<string, string> = {}
      selectedCard.variables.forEach((variable) => {
        initialVariables[variable] = ''
      })
      setVariables(initialVariables)
    } else {
      setVariables({})
    }
  }, [postType, selectedCard])

  const generateImagePrompt = async () => {
    setIsGeneratingPrompt(true)
    const brief = form.getValues('brief')
    const style = form.getValues('imageStyle') || 'photorealistic'

    try {
      // This is a mock implementation - will be replaced with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock response
      const generatedPrompt = `A ${style} image of ${brief}, high quality, detailed, professional lighting, 8k resolution`

      form.setValue('imagePrompt', generatedPrompt)
    } catch (error) {
      console.error('Error generating prompt:', error)
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  const generateImageVariations = async () => {
    if (!selectedImage) return

    setIsGeneratingVariations(true)

    try {
      // In a real implementation, this would call an AI image variation API
      // For now, we'll simulate with different Unsplash images
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const variations = [
        selectedImage, // Original image
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80',
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80',
      ]

      setImageVariations(variations)
    } catch (error) {
      console.error('Error generating image variations:', error)
    } finally {
      setIsGeneratingVariations(false)
    }
  }

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId)
    form.setValue('imageStyle', styleId)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true)

    try {
      if (generateVariants) {
        // Generate 3 variants of the post
        const variants = 3

        // Define variations for different post types
        const engagementVariations = [
          {
            emoji: '📣',
            ending:
              'What do you think? Share your thoughts in the comments below! 👇 #engagement #feedback',
          },
          { emoji: '💬', ending: 'Let me know what you think! #conversation #community' },
          { emoji: '🔍', ending: "What's your experience with this? #discuss #connect" },
        ]

        const promotionalVariations = [
          {
            emoji: '🔥',
            intro: 'SPECIAL OFFER!',
            ending: "Don't miss out! Limited time only. #promotion #specialoffer",
          },
          {
            emoji: '💯',
            intro: 'EXCLUSIVE DEAL!',
            ending: "Act fast before it's gone! #exclusive #limitedtime",
          },
          {
            emoji: '🎁',
            intro: 'AMAZING OPPORTUNITY!',
            ending: 'Grab yours today! #deal #opportunity',
          },
        ]

        const educationalVariations = [
          {
            emoji: '📚',
            intro: 'Did you know?',
            ending: 'Learn something new every day! #didyouknow #learning',
          },
          {
            emoji: '💡',
            intro: 'Fascinating fact:',
            ending: 'Knowledge is power! #facts #education',
          },
          {
            emoji: '🧠',
            intro: "Here's something interesting:",
            ending: 'Always keep learning! #growth #knowledge',
          },
        ]

        const announcementVariations = [
          {
            emoji: '📢',
            intro: 'ANNOUNCEMENT',
            ending: 'Stay tuned for more updates! #announcement #news',
          },
          {
            emoji: '🚨',
            intro: 'IMPORTANT UPDATE',
            ending: 'More details coming soon! #update #important',
          },
          {
            emoji: '📣',
            intro: 'BIG NEWS',
            ending: 'Follow us for the latest information! #bignews #followup',
          },
        ]

        // Image URLs for variants
        const imageUrls = [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
          'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80',
          'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80',
          'https://images.unsplash.com/photo-1605106702734-205df224ecce?w=800&q=80',
          'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
          'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=800&q=80',
        ]

        // Generate variants
        for (let i = 0; i < variants; i++) {
          // Wait a bit between generating variants to avoid overwhelming the UI
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 500))
          }

          // Select image URL for this variant
          let imageUrl
          if (values.includeImage) {
            imageUrl = imageUrls[i % imageUrls.length]
          }

          // Generate content based on post type with variations
          let content = ''
          switch (values.postType) {
            case 'engagement': {
              const variation = engagementVariations[i % engagementVariations.length]
              content = `${variation.emoji} ${values.brief}\n\n${variation.ending}`
              break
            }
            case 'promotional': {
              const variation = promotionalVariations[i % promotionalVariations.length]
              content = `${variation.emoji} ${variation.intro} ${variation.emoji}\n\n${values.brief}\n\n${variation.ending}`
              break
            }
            case 'educational': {
              const variation = educationalVariations[i % educationalVariations.length]
              content = `${variation.emoji} ${variation.intro}\n\n${values.brief}\n\n${variation.ending}`
              break
            }
            case 'announcement': {
              const variation = announcementVariations[i % announcementVariations.length]
              content = `${variation.emoji} ${variation.intro} ${variation.emoji}\n\n${values.brief}\n\n${variation.ending}`
              break
            }
            default:
              content = `${values.brief}\n\nThanks for reading! #social #post`
          }

          // Add profile context if selected
          if (values.profile) {
            const profileContext = values.profile.split('_').join(' ')
            content = `[Using ${profileContext}] ${content}`
          }

          // Create post object
          const generatedPost = {
            content,
            imageUrl,
            isStory: values.postFormat === 'story',
          }

          // Add post to global state
          addPost(generatedPost)
        }
      } else {
        // Generate a single post
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Mock image URL based on selected model
        let imageUrl
        if (values.includeImage) {
          switch (values.imageModel) {
            case 'minimax':
              imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'
              break
            case 'juggernaut':
              imageUrl = 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80'
              break
            case 'ideogram':
            default:
              imageUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80'
          }
        }

        // Generate content based on selected card's prompt if available
        let content = ''

        if (selectedCard?.prompt) {
          // Start with the prompt template
          content = selectedCard.prompt

          // Replace variables in the prompt
          if (selectedCard.variables) {
            selectedCard.variables.forEach((variable) => {
              const value = variables[variable] || values.brief
              content = content.replace(`{${variable}}`, value)
            })
          }

          // Add profile context if selected
          if (values.profile) {
            const profileContext = values.profile.split('_').join(' ')
            content = `[Using ${profileContext}] ${content}`
          }
        } else {
          // Fallback to default content generation if no card selected
          switch (values.postType) {
            case 'engagement':
              content = `📣 ${values.brief}\n\nWhat do you think? Share your thoughts in the comments below! 👇 #engagement #feedback`
              break
            case 'promotional':
              content = `🔥 SPECIAL OFFER! 🔥\n\n${values.brief}\n\nDon't miss out! Limited time only. #promotion #specialoffer`
              break
            case 'educational':
              content = `📚 Did you know?\n\n${values.brief}\n\nLearn something new every day! #didyouknow #learning`
              break
            case 'announcement':
              content = `📢 ANNOUNCEMENT 📢\n\n${values.brief}\n\nStay tuned for more updates! #announcement #news`
              break
            default:
              content = `${values.brief}\n\nThanks for reading! #social #post`
          }

          // Add profile context if selected
          if (values.profile) {
            const profileContext = values.profile.split('_').join(' ')
            content = `[Using ${profileContext}] ${content}`
          }
        }

        // Create post object with enhanced visual features
        const generatedPost = {
          content,
          imageUrl,
          isStory: values.postFormat === 'story',
          textOverlay: textOverlay.isVisible ? textOverlay : undefined,
          animationStyle,
          colorBlockStyle: colorBlockStyle.enabled ? colorBlockStyle : undefined,
        }

        addPost(generatedPost)
      }

      // Reset form after successful generation
      form.reset({
        brief: '',
        postType: '',
        profile: '',
        includeImage: false,
        imageModel: 'ideogram',
        imagePrompt: '',
        imageStyle: '',
        postFormat: 'regular',
      })
      setSelectedStyle(null)
      setVariables({})
    } catch (error) {
      console.error('Error generating post:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="postFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Format</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular">Regular Post</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="story" id="story" />
                    <Label htmlFor="story">Facebook Story</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Choose whether to create a regular post or a Facebook Story
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brief"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brief Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what you want to post about..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a post type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contentCards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Profile</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a profile" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="brand_voice_professional">
                    Brand Voice: Professional
                  </SelectItem>
                  <SelectItem value="brand_voice_casual">Brand Voice: Casual</SelectItem>
                  <SelectItem value="brand_voice_friendly">Brand Voice: Friendly</SelectItem>
                  <SelectItem value="product_voice_technical">Product Voice: Technical</SelectItem>
                  <SelectItem value="product_voice_benefits">
                    Product Voice: Benefits-focused
                  </SelectItem>
                  <SelectItem value="dataset_industry">Dataset: Industry Specific</SelectItem>
                  <SelectItem value="dataset_audience">Dataset: Audience Specific</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select a profile to influence the AI's writing style and content focus
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Show variable inputs if the selected card has variables */}
        {selectedCard?.variables && selectedCard.variables.length > 0 && (
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-sm font-medium">Customize your {selectedCard.label}</h3>
            {selectedCard.variables.map((variable) => (
              <div key={variable} className="space-y-2">
                <Label htmlFor={`variable-${variable}`}>
                  {variable.charAt(0).toUpperCase() + variable.slice(1)}
                </Label>
                <Input
                  id={`variable-${variable}`}
                  placeholder={`Enter ${variable}...`}
                  value={variables[variable] || ''}
                  onChange={(e) => setVariables({ ...variables, [variable]: e.target.value })}
                />
              </div>
            ))}
          </div>
        )}

        {/* Post Templates based on post format */}
        <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
          <h3 className="text-sm font-medium">Template Preview</h3>

          {postFormat === 'regular' ? (
            <div className="rounded-md border bg-background p-4">
              <h4 className="mb-2 text-sm font-semibold">Feed Post Template</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                  <div>
                    <p className="text-sm font-medium">Your Page Name</p>
                    <p className="text-xs text-muted-foreground">
                      Just now · <span>🌎</span>
                    </p>
                  </div>
                </div>
                <p className="text-sm">
                  {profile ? `[${profile.split('_').join(' ').toUpperCase()}] ` : ''}Your post
                  content will appear here...
                </p>
                <div className="flex aspect-video w-full items-center justify-center rounded-md bg-muted">
                  {includeImage ? (
                    <p className="text-sm text-muted-foreground">Your image will appear here</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No image selected</p>
                  )}
                </div>
                <div className="flex justify-between border-t pt-2 text-xs text-muted-foreground">
                  <span>0 Likes</span>
                  <span>0 Comments</span>
                  <span>0 Shares</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border bg-background p-4">
              <h4 className="mb-2 text-sm font-semibold">Story Template</h4>
              <div className="relative mx-auto flex aspect-[9/16] w-full max-w-[200px] flex-col items-center justify-center rounded-md border bg-muted">
                <div className="absolute left-2 right-2 top-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20"></div>
                  <p className="text-xs font-medium">Your Page Name</p>
                </div>
                {includeImage ? (
                  <div className="flex w-full flex-1 items-center justify-center">
                    <p className="text-xs text-muted-foreground">Your image will appear here</p>
                  </div>
                ) : (
                  <div className="flex w-full flex-1 items-center justify-center bg-gradient-to-b from-primary/10 to-primary/30">
                    <p className="px-4 text-center text-sm font-medium">
                      {profile ? `[${profile.split('_').join(' ').toUpperCase()}] ` : ''}Your story
                      content will appear here...
                    </p>
                  </div>
                )}
                <div className="absolute bottom-4 w-full px-4">
                  <div className="flex h-10 items-center justify-center rounded-full bg-background/80">
                    <p className="text-xs">Swipe up</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="includeImage"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Generate Image</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Include an AI-generated image with your post
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {includeImage && (
          <div className="space-y-6 rounded-lg border p-4">
            {/* Image Variations Generator */}
            {selectedImage && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Image Variations</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateImageVariations}
                    disabled={isGeneratingVariations}
                  >
                    {isGeneratingVariations ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>Generate Variations</>
                    )}
                  </Button>
                </div>

                {imageVariations.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {imageVariations.map((variation, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer overflow-hidden rounded-md border-2 ${selectedVariation === index ? 'border-blue-500' : 'border-transparent'}`}
                        onClick={() => setSelectedVariation(index)}
                      >
                        <img
                          src={variation}
                          alt={`Variation ${index + 1}`}
                          className="h-20 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <FormField
              control={form.control}
              name="imageModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image AI Model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an AI model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="minimax">MiniMax (Hailuo AI)</SelectItem>
                      <SelectItem value="juggernaut">Juggernaut Flux Base LoRA</SelectItem>
                      <SelectItem value="ideogram">Ideogram V2A</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Different models produce different styles and qualities of images
                  </FormDescription>
                </FormItem>
              )}
            />

            <Tabs defaultValue="prompt-generator">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prompt-generator">AI Prompt Generator</TabsTrigger>
                <TabsTrigger value="manual-prompt">Manual Prompt</TabsTrigger>
              </TabsList>

              <TabsContent value="prompt-generator" className="space-y-4 pt-4">
                <div>
                  <h4 className="mb-3 font-medium">Select Image Style</h4>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {imageStyles.map((style) => (
                      <Card
                        key={style.id}
                        className={`cursor-pointer transition-all`}
                        style={{
                          borderWidth: selectedStyle === style.id ? '2px' : '1px',
                          borderColor:
                            selectedStyle === style.id ? whiteLabelSettings.primaryColor : '',
                          ':hover': { borderColor: whiteLabelSettings.primaryColor },
                        }}
                        onClick={() => handleStyleSelect(style.id)}
                      >
                        <CardContent className="p-3">
                          <div className="mb-2 aspect-video w-full overflow-hidden rounded-md bg-muted">
                            <img
                              src={style.example}
                              alt={style.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <h5 className="font-medium">{style.name}</h5>
                          <p className="text-xs text-muted-foreground">{style.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={generateImagePrompt}
                  disabled={isGeneratingPrompt}
                >
                  {isGeneratingPrompt ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Prompt...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Image Prompt
                    </>
                  )}
                </Button>

                <FormField
                  control={form.control}
                  name="imagePrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Generated Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your AI-generated prompt will appear here..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can edit this prompt to fine-tune the image generation
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="manual-prompt" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="imagePrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the image you want to generate..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be detailed and specific about what you want in the image
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            {/* Text Overlay Options */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Text Overlay</h3>
                <Switch
                  checked={textOverlay.isVisible}
                  onCheckedChange={(checked) =>
                    setTextOverlay({ ...textOverlay, isVisible: checked })
                  }
                />
              </div>

              {textOverlay.isVisible && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="overlay-text">Overlay Text</Label>
                    <Textarea
                      id="overlay-text"
                      placeholder="Enter text to overlay on the image..."
                      value={textOverlay.text}
                      onChange={(e) => setTextOverlay({ ...textOverlay, text: e.target.value })}
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="overlay-position">Position</Label>
                      <Select
                        value={textOverlay.position}
                        onValueChange={(value) =>
                          setTextOverlay({ ...textOverlay, position: value as any })
                        }
                      >
                        <SelectTrigger id="overlay-position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="top-center">Top Center</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="bottom-center">Bottom Center</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overlay-font">Font Family</Label>
                      <Select
                        value={textOverlay.fontFamily}
                        onValueChange={(value) =>
                          setTextOverlay({ ...textOverlay, fontFamily: value })
                        }
                      >
                        <SelectTrigger id="overlay-font">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Courier New">Courier New</SelectItem>
                          <SelectItem value="Verdana">Verdana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="overlay-color">Text Color</Label>
                      <div className="flex">
                        <Input
                          id="overlay-color"
                          type="color"
                          value={textOverlay.color}
                          onChange={(e) =>
                            setTextOverlay({ ...textOverlay, color: e.target.value })
                          }
                          className="w-12"
                        />
                        <Input
                          type="text"
                          value={textOverlay.color}
                          onChange={(e) =>
                            setTextOverlay({ ...textOverlay, color: e.target.value })
                          }
                          className="ml-2 flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overlay-bg-color">Background Color</Label>
                      <div className="flex">
                        <Input
                          id="overlay-bg-color"
                          type="color"
                          value={textOverlay.backgroundColor
                            .replace('rgba', 'rgb')
                            .replace(/,[^,]*\)/, ')')}
                          onChange={(e) =>
                            setTextOverlay({ ...textOverlay, backgroundColor: e.target.value })
                          }
                          className="w-12"
                        />
                        <Input
                          type="text"
                          value={textOverlay.backgroundColor}
                          onChange={(e) =>
                            setTextOverlay({ ...textOverlay, backgroundColor: e.target.value })
                          }
                          className="ml-2 flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Animation Style */}
            <div className="mt-4 space-y-4">
              <h3 className="text-sm font-medium">Animation Style</h3>
              <RadioGroup
                value={animationStyle}
                onValueChange={(value) => setAnimationStyle(value as AnimationStyle)}
                className="grid grid-cols-3 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="animation-none" />
                  <Label htmlFor="animation-none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fade-in" id="animation-fade-in" />
                  <Label htmlFor="animation-fade-in">Fade In</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="slide-up" id="animation-slide-up" />
                  <Label htmlFor="animation-slide-up">Slide Up</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pulse" id="animation-pulse" />
                  <Label htmlFor="animation-pulse">Pulse</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bounce" id="animation-bounce" />
                  <Label htmlFor="animation-bounce">Bounce</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Color Block Style */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Color Block Style</h3>
                <Switch
                  checked={colorBlockStyle.enabled}
                  onCheckedChange={(checked) =>
                    setColorBlockStyle({ ...colorBlockStyle, enabled: checked })
                  }
                />
              </div>

              {colorBlockStyle.enabled && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="block-bg-color">Background</Label>
                    <div className="flex">
                      <Input
                        id="block-bg-color"
                        type="color"
                        value={colorBlockStyle.backgroundColor}
                        onChange={(e) =>
                          setColorBlockStyle({
                            ...colorBlockStyle,
                            backgroundColor: e.target.value,
                          })
                        }
                        className="w-12"
                      />
                      <Input
                        type="text"
                        value={colorBlockStyle.backgroundColor}
                        onChange={(e) =>
                          setColorBlockStyle({
                            ...colorBlockStyle,
                            backgroundColor: e.target.value,
                          })
                        }
                        className="ml-2 flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="block-text-color">Text Color</Label>
                    <div className="flex">
                      <Input
                        id="block-text-color"
                        type="color"
                        value={colorBlockStyle.textColor}
                        onChange={(e) =>
                          setColorBlockStyle({ ...colorBlockStyle, textColor: e.target.value })
                        }
                        className="w-12"
                      />
                      <Input
                        type="text"
                        value={colorBlockStyle.textColor}
                        onChange={(e) =>
                          setColorBlockStyle({ ...colorBlockStyle, textColor: e.target.value })
                        }
                        className="ml-2 flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="block-border-color">Border Color</Label>
                    <div className="flex">
                      <Input
                        id="block-border-color"
                        type="color"
                        value={colorBlockStyle.borderColor || '#dddfe2'}
                        onChange={(e) =>
                          setColorBlockStyle({ ...colorBlockStyle, borderColor: e.target.value })
                        }
                        className="w-12"
                      />
                      <Input
                        type="text"
                        value={colorBlockStyle.borderColor || '#dddfe2'}
                        onChange={(e) =>
                          setColorBlockStyle({ ...colorBlockStyle, borderColor: e.target.value })
                        }
                        className="ml-2 flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isGenerating || isLoadingContentCards}
          style={{
            backgroundColor: whiteLabelSettings.primaryColor,
            ':hover': { backgroundColor: whiteLabelSettings.secondaryColor },
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              {postFormat === 'story' ? (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate Story
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {generateVariants ? 'Generate Post Variants' : 'Generate Post'}
                </>
              )}
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
