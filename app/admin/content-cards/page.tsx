import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ContentCardsList from '@/components/admin/ContentCardsList'
import CreateContentCardForm from '@/components/admin/CreateContentCardForm'

export const metadata: Metadata = {
  title: 'Content Cards',
  description: 'Manage content cards and AI prompts',
}

export default function ContentCardsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Content Cards</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Content Card</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateContentCardForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Content Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentCardsList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
