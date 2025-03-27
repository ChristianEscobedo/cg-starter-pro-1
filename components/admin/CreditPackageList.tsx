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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  isActive: boolean
}

// Mock data - would be replaced with real data from API
const mockPackages: CreditPackage[] = [
  {
    id: '1',
    name: 'Starter',
    credits: 100,
    price: 9.99,
    isActive: true,
  },
  {
    id: '2',
    name: 'Professional',
    credits: 500,
    price: 39.99,
    isActive: true,
  },
  {
    id: '3',
    name: 'Enterprise',
    credits: 2000,
    price: 99.99,
    isActive: true,
  },
  {
    id: '4',
    name: 'Limited Offer',
    credits: 300,
    price: 19.99,
    isActive: false,
  },
]

export default function CreditPackageList() {
  const [packages, setPackages] = useState<CreditPackage[]>(mockPackages)
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const togglePackageStatus = (id: string) => {
    setPackages(packages.map((pkg) => (pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg)))
    toast.success(`Package status updated`)
  }

  const deletePackage = () => {
    if (selectedPackage) {
      setPackages(packages.filter((pkg) => pkg.id !== selectedPackage.id))
      setDeleteDialogOpen(false)
      setSelectedPackage(null)
      toast.success(`Package deleted`)
    }
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>{pkg.credits}</TableCell>
                <TableCell>${pkg.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={pkg.isActive ? 'default' : 'outline'}>
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => togglePackageStatus(pkg.id)}>
                      {pkg.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedPackage(pkg)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {selectedPackage?.name} package. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletePackage}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
