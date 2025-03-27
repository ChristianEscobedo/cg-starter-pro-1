'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type ActivityItem = {
  id: string
  type: 'post' | 'credit' | 'sequence'
  title: string
  date: string
  amount?: number
  imageUrl?: string
}

const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'post',
    title: 'Created Facebook Post',
    date: '2 hours ago',
    amount: -5,
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=post1',
  },
  {
    id: '2',
    type: 'credit',
    title: 'Purchased Credits',
    date: '1 day ago',
    amount: 100,
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=credit1',
  },
  {
    id: '3',
    type: 'sequence',
    title: 'Created Post Sequence',
    date: '3 days ago',
    amount: -15,
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sequence1',
  },
  {
    id: '4',
    type: 'post',
    title: 'Created Facebook Story',
    date: '5 days ago',
    amount: -3,
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=story1',
  },
]

export default function RecentActivity() {
  return (
    <div className="space-y-4">
      {recentActivity.map((item) => (
        <div key={item.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={item.imageUrl} />
            <AvatarFallback>{item.type.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.date}</p>
          </div>
          {item.amount && (
            <div
              className={`text-sm font-medium ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {item.amount > 0 ? '+' : ''}
              {item.amount} credits
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
