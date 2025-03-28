'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  ThumbsUp,
  MessageSquare,
  Share,
  Send,
  Edit2,
  Check,
  MoreHorizontal,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

type TextOverlay = {
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
  backgroundColor?: string
  padding?: string
  isVisible: boolean
}

type AnimationStyle = 'none' | 'fade-in' | 'slide-up' | 'pulse' | 'bounce'

type ColorBlockStyle = {
  enabled: boolean
  backgroundColor: string
  textColor: string
  borderColor?: string
}

type FacebookPostPreviewProps = {
  content: string
  imageUrl?: string
  isStory?: boolean
  variants?: Array<{ id: string; content: string; imageUrl?: string }>
  currentVariantIndex?: number
  onSelectVariant?: (index: number) => void
  textOverlay?: TextOverlay
  animationStyle?: AnimationStyle
  colorBlockStyle?: ColorBlockStyle
}

export default function FacebookPostPreview({
  content,
  imageUrl,
  isStory = false,
  variants = [],
  currentVariantIndex = 0,
  onSelectVariant = () => {},
  textOverlay = {
    text: '',
    position: 'center',
    fontFamily: 'Arial',
    fontSize: '24px',
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '8px',
    isVisible: false,
  },
  animationStyle = 'none',
  colorBlockStyle = {
    enabled: false,
    backgroundColor: '#f0f2f5',
    textColor: '#1c1e21',
    borderColor: '#dddfe2',
  },
}: FacebookPostPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  // Helper function to get position classes for text overlay
  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0'
      case 'top-center':
        return 'top-0 left-1/2 -translate-x-1/2'
      case 'top-right':
        return 'top-0 right-0'
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      case 'bottom-left':
        return 'bottom-0 left-0'
      case 'bottom-center':
        return 'bottom-0 left-1/2 -translate-x-1/2'
      case 'bottom-right':
        return 'bottom-0 right-0'
      default:
        return 'top-0 left-0'
    }
  }

  // Helper function to get animation classes
  const getAnimationClass = (animation: AnimationStyle) => {
    switch (animation) {
      case 'fade-in':
        return 'animate-fade-in'
      case 'slide-up':
        return 'animate-slide-up'
      case 'pulse':
        return 'animate-pulse'
      case 'bounce':
        return 'animate-bounce'
      default:
        return ''
    }
  }

  const handlePost = () => {
    // This would be replaced with actual posting logic
    alert(`Post would be published to Facebook as a ${isStory ? 'story' : 'regular post'}!`)
  }

  if (isStory) {
    return (
      <Card className="mx-auto h-[600px] w-[340px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="relative h-full w-full">
          {/* Story background - either image or gradient */}
          {imageUrl ? (
            <div className="absolute inset-0 h-full w-full">
              <img src={imageUrl} alt="Story background" className="h-full w-full object-cover" />
              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

              {/* Text overlay */}
              {textOverlay.isVisible && textOverlay.text && (
                <div className={`absolute ${getPositionClasses(textOverlay.position)} z-20 p-4`}>
                  <div
                    style={{
                      fontFamily: textOverlay.fontFamily,
                      fontSize: textOverlay.fontSize,
                      color: textOverlay.color,
                      backgroundColor: textOverlay.backgroundColor,
                      padding: textOverlay.padding,
                    }}
                    className="rounded-md backdrop-blur-sm"
                  >
                    {textOverlay.text}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
          )}

          {/* Story header */}
          <div className="absolute left-0 right-0 top-0 z-10 p-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-blue-500 bg-white">
                <Avatar className="h-full w-full">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                    U
                  </div>
                </Avatar>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Your Page Name</p>
                <p className="text-xs text-white/80">Just now</p>
              </div>
            </div>
          </div>

          {/* Story content */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-center">
            <p className="mb-6 text-xl font-semibold text-white drop-shadow-md">{editedContent}</p>

            {/* Story interaction buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
              >
                <Heart className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
              >
                <MessageSquare className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>

            {/* Story progress bar */}
            <div className="mt-6 h-1 w-full rounded-full bg-white/30">
              <div className="h-full w-3/4 rounded-full bg-white"></div>
            </div>
          </div>

          {/* Story views */}
          <div className="absolute bottom-24 right-6 z-10 flex items-center rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
            <Eye className="mr-1 h-4 w-4 text-white" />
            <span className="text-sm text-white">128</span>
          </div>
        </div>

        {/* Edit and post buttons outside the story view */}
        <div className="mt-4 flex w-full space-x-2 p-4">
          {isEditing ? (
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button
              onClick={handleEdit}
              variant="outline"
              className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Story
            </Button>
          )}
          <Button onClick={handlePost} className="flex-1 bg-blue-500 text-white hover:bg-blue-600">
            <Send className="mr-2 h-4 w-4" />
            Post to Facebook
          </Button>
        </div>

        {/* Edit mode */}
        {isEditing && (
          <div className="p-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px] border-blue-500 focus-visible:ring-blue-500"
              placeholder="Edit your story text..."
            />
          </div>
        )}
      </Card>
    )
  }

  // Regular post view
  return (
    <Card className="mx-auto max-w-[500px] border border-gray-200 bg-white shadow-md">
      <CardHeader className="px-4 pb-2 pt-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10 border border-gray-200">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                U
              </div>
            </Avatar>
            <div>
              <p className="text-[15px] font-semibold text-[#050505]">Your Page Name</p>
              <div className="flex items-center text-xs text-[#65676B]">
                <span>Just now</span>
                <span className="mx-1">·</span>
                <span>🌎</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreHorizontal className="h-5 w-5 text-[#65676B]" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2 pt-0">
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="mb-3 min-h-[100px] border-blue-500 focus-visible:ring-blue-500"
          />
        ) : (
          <>
            {colorBlockStyle.enabled ? (
              <div
                style={{
                  backgroundColor: colorBlockStyle.backgroundColor,
                  color: colorBlockStyle.textColor,
                  borderColor: colorBlockStyle.borderColor,
                }}
                className={`mb-3 whitespace-pre-line rounded-md border p-4 ${getAnimationClass(animationStyle)}`}
              >
                <p className="text-[15px] leading-[1.3333]">{editedContent}</p>
              </div>
            ) : (
              <p
                className={`mb-3 whitespace-pre-line text-[15px] leading-[1.3333] text-[#050505] ${getAnimationClass(animationStyle)}`}
              >
                {editedContent}
              </p>
            )}
          </>
        )}

        {imageUrl && (
          <div className="relative mb-1 overflow-hidden rounded-lg border border-gray-200">
            <img
              src={imageUrl}
              alt="Post image"
              className={`h-auto w-full object-cover ${getAnimationClass(animationStyle)}`}
            />

            {/* Text overlay */}
            {textOverlay.isVisible && textOverlay.text && (
              <div className={`absolute ${getPositionClasses(textOverlay.position)} z-10 p-4`}>
                <div
                  style={{
                    fontFamily: textOverlay.fontFamily,
                    fontSize: textOverlay.fontSize,
                    color: textOverlay.color,
                    backgroundColor: textOverlay.backgroundColor,
                    padding: textOverlay.padding,
                  }}
                  className="rounded-md backdrop-blur-sm"
                >
                  {textOverlay.text}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-1 px-4 pb-3 pt-0">
        <div className="flex w-full items-center justify-between py-1 text-xs text-[#65676B]">
          <div className="flex items-center">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-blue-500">
              <ThumbsUp className="h-[10px] w-[10px] text-white" />
            </div>
            <span className="ml-1">0</span>
          </div>
          <div className="flex space-x-2">
            <span>0 comments</span>
            <span>0 shares</span>
          </div>
        </div>
        <div className="my-1 h-[1px] w-full bg-gray-200"></div>
        <div className="flex w-full justify-between py-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-md text-[#65676B] hover:bg-gray-100"
          >
            <ThumbsUp className="mr-2 h-5 w-5" />
            Like
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-md text-[#65676B] hover:bg-gray-100"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Comment
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-md text-[#65676B] hover:bg-gray-100"
          >
            <Share className="mr-2 h-5 w-5" />
            Share
          </Button>
        </div>
        <div className="my-1 h-[1px] w-full bg-gray-200"></div>
        <div className="mt-2 flex w-full space-x-2">
          {isEditing ? (
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button
              onClick={handleEdit}
              variant="outline"
              className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Post
            </Button>
          )}
          <Button onClick={handlePost} className="flex-1 bg-blue-500 text-white hover:bg-blue-600">
            <Send className="mr-2 h-4 w-4" />
            Post to Facebook
          </Button>
        </div>
      </CardFooter>

      {/* Variants slider */}
      {variants.length > 1 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectVariant(Math.max(0, currentVariantIndex - 1))}
              disabled={currentVariantIndex === 0}
              className="text-pink-500"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous Variant
            </Button>
            <div className="flex items-center space-x-2">
              {variants.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 cursor-pointer rounded-full ${index === currentVariantIndex ? 'bg-pink-500' : 'bg-gray-300'}`}
                  onClick={() => onSelectVariant(index)}
                ></div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onSelectVariant(Math.min(variants.length - 1, currentVariantIndex + 1))
              }
              disabled={currentVariantIndex === variants.length - 1}
              className="text-pink-500"
            >
              Next Variant
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
