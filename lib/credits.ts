import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CreditTransaction = {
  id: string
  amount: number
  description: string
  date: Date
  type: 'purchase' | 'usage'
}

type CreditsStore = {
  credits: number
  transactions: CreditTransaction[]
  addCredits: (amount: number) => void
  useCredits: (amount: number, description: string) => boolean
  getTransactions: () => CreditTransaction[]
}

export const useCreditsStore = create<CreditsStore>(
  persist(
    (set, get) => ({
      credits: 100, // Start with 100 free credits
      transactions: [],
      addCredits: (amount) => {
        set((state) => ({
          credits: state.credits + amount,
          transactions: [
            {
              id: Date.now().toString(),
              amount,
              description: `Purchased ${amount} credits`,
              date: new Date(),
              type: 'purchase',
            },
            ...state.transactions,
          ],
        }))
      },
      useCredits: (amount, description) => {
        const { credits } = get()
        if (credits < amount) return false

        set((state) => ({
          credits: state.credits - amount,
          transactions: [
            {
              id: Date.now().toString(),
              amount: -amount,
              description,
              date: new Date(),
              type: 'usage',
            },
            ...state.transactions,
          ],
        }))
        return true
      },
      getTransactions: () => get().transactions,
    }),
    {
      name: 'credits-storage',
    }
  )
)

export function useCredits() {
  const { credits, addCredits, useCredits, getTransactions } = useCreditsStore()
  return { credits, addCredits, useCredits, getTransactions }
}
