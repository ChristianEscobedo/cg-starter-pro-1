'use client'

import { create } from 'zustand'

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

type PostItem = {
  id: string
  content: string
  imageUrl?: string
  isStory?: boolean
  textOverlay?: TextOverlay
  animationStyle?: AnimationStyle
  colorBlockStyle?: ColorBlockStyle
}

type PostState = {
  posts: PostItem[]
  currentPostIndex: number
  isCreatingNew: boolean
  selectedImage: string | null
  addPost: (post: {
    content: string
    imageUrl?: string
    isStory?: boolean
    textOverlay?: TextOverlay
    animationStyle?: AnimationStyle
    colorBlockStyle?: ColorBlockStyle
  }) => void
  setCurrentPostIndex: (index: number) => void
  setIsCreatingNew: (value: boolean) => void
  setSelectedImage: (url: string | null) => void
  resetForm: () => void
  deletePost: (id: string) => void
}

export const usePostState = create<PostState>((set) => ({
  posts: [],
  currentPostIndex: 0,
  isCreatingNew: true,
  selectedImage: null,
  addPost: (post) => {
    const newPost = {
      id: Date.now().toString(),
      ...post,
      imageUrl: post.imageUrl || null,
    }

    set((state) => {
      const newPosts = [...state.posts, newPost]
      return {
        posts: newPosts,
        currentPostIndex: newPosts.length - 1,
        isCreatingNew: false,
      }
    })
  },
  setCurrentPostIndex: (index) => set({ currentPostIndex: index }),
  setIsCreatingNew: (value) => set({ isCreatingNew: value }),
  setSelectedImage: (url) => set({ selectedImage: url }),
  resetForm: () => set({ isCreatingNew: true }),
  deletePost: (id) => {
    set((state) => {
      const newPosts = state.posts.filter((post) => post.id !== id)
      let newIndex = state.currentPostIndex

      if (state.currentPostIndex >= newPosts.length) {
        newIndex = Math.max(0, newPosts.length - 1)
      }

      return {
        posts: newPosts,
        currentPostIndex: newIndex,
        isCreatingNew: newPosts.length === 0 ? true : state.isCreatingNew,
      }
    })
  },
}))
