'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/types'
import { useCredits } from '@/lib/credits'
import { toast } from 'sonner'

// Mock data - would be replaced with real data from API
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    tenantId: 'tenant-1',
    role: 'admin',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    tenantId: 'tenant-1',
    role: 'user',
    createdAt: '2023-02-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    tenantId: 'tenant-2',
    role: 'user',
    createdAt: '2023-03-10',
  },
]

interface AssignCreditsFormProps {
  userId: string
  userName: string
  onAssign: (userId: string, amount: number) => void
  onClose: () => void
}

function AssignCreditsForm({ userId, userName, onAssign, onClose }: AssignCreditsFormProps) {
  const [amount, setAmount] = useState(100)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAssign(userId, amount)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="credits">Credits Amount</Label>
        <Input
          id="credits"
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />
      </div>
      <Button type="submit" className="w-full">
        Assign Credits
      </Button>
    </form>
  )
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { addCredits } = useCredits()

  const handleAssignCredits = (userId: string, amount: number) => {
    // In a real app, this would call an API to assign credits to the user
    // For now, we'll just show a toast notification
    addCredits(amount) // This is just for demonstration
    toast.success(`Assigned ${amount} credits to user`)
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.tenantId}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Dialog
                    open={dialogOpen && selectedUser?.id === user.id}
                    onOpenChange={(open) => {
                      setDialogOpen(open)
                      if (!open) setSelectedUser(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setDialogOpen(true)
                        }}
                      >
                        Assign Credits
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Credits to {selectedUser?.name}</DialogTitle>
                      </DialogHeader>
                      {selectedUser && (
                        <AssignCreditsForm
                          userId={selectedUser.id}
                          userName={selectedUser.name}
                          onAssign={handleAssignCredits}
                          onClose={() => setDialogOpen(false)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
