"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Package, AlertTriangle, Trash2, Edit, Camera, Scan, Users, Filter, ChefHat } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { usePantry } from "@/lib/pantry-context"
import { useAuth } from "@/lib/auth-context"
import { PantryProvider } from "@/lib/pantry-context"

function PantryPageContent() {
  const { items, addItem, removeItem, getExpiringItems, searchItems } = usePantry()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm({
    defaultValues: {
      name: "",
      quantity: 1,
      unit: "pieces",
      location: "pantry" as const,
      expiryDate: "",
      category: "other",
    },
  })

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return { status: "expired", color: "destructive", days: Math.abs(daysUntilExpiry) }
    if (daysUntilExpiry <= 3) return { status: "expiring", color: "secondary", days: daysUntilExpiry }
    if (daysUntilExpiry <= 7) return { status: "soon", color: "outline", days: daysUntilExpiry }
    return { status: "fresh", color: "default", days: daysUntilExpiry }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = searchQuery ? searchItems(searchQuery).includes(item) : true
    const matchesLocation = locationFilter === "all" || item.location === locationFilter
    return matchesSearch && matchesLocation
  })

  const onSubmit = (data: any) => {
    addItem({
      ...data,
      addedBy: user?.id || "unknown",
    })
    setIsAddDialogOpen(false)
    form.reset()
    toast({
      title: "Item added",
      description: `${data.name} has been added to your pantry.`,
    })
  }

  const deleteItem = (id: string) => {
    removeItem(id)
    toast({
      title: "Item removed",
      description: "Item has been removed from your pantry.",
    })
  }

  const expiringItems = getExpiringItems(7)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="font-mono font-bold text-xl text-foreground">PantryMatch</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Household
              </Button>
              <Button variant="outline" size="sm">
                Match Recipes
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-mono font-bold text-3xl text-foreground mb-2">Pantry Management</h1>
            <p className="text-muted-foreground">Track your ingredients and reduce food waste</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Scan Receipt
            </Button>
            <Button variant="outline" size="sm">
              <Scan className="h-4 w-4 mr-2" />
              Barcode
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Pantry Item</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Chicken Breast" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pieces">pieces</SelectItem>
                                <SelectItem value="g">grams</SelectItem>
                                <SelectItem value="kg">kilograms</SelectItem>
                                <SelectItem value="ml">milliliters</SelectItem>
                                <SelectItem value="l">liters</SelectItem>
                                <SelectItem value="cups">cups</SelectItem>
                                <SelectItem value="containers">containers</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fridge">Fridge</SelectItem>
                              <SelectItem value="freezer">Freezer</SelectItem>
                              <SelectItem value="pantry">Pantry</SelectItem>
                              <SelectItem value="spice-rack">Spice Rack</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="protein">Protein</SelectItem>
                              <SelectItem value="vegetables">Vegetables</SelectItem>
                              <SelectItem value="fruits">Fruits</SelectItem>
                              <SelectItem value="dairy">Dairy</SelectItem>
                              <SelectItem value="grains">Grains</SelectItem>
                              <SelectItem value="spices">Spices</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        Add Item
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Expiry Alerts */}
        {expiringItems.length > 0 && (
          <Card className="mb-6 border-secondary bg-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <AlertTriangle className="h-5 w-5" />
                Items Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {expiringItems.map((item) => {
                  const status = getExpiryStatus(item.expiryDate)
                  return (
                    <Badge key={item.id} variant={status.color as any} className="text-xs">
                      {item.name} - {status.status === "expired" ? `${status.days}d ago` : `${status.days}d left`}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pantry items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="fridge">Fridge</SelectItem>
              <SelectItem value="freezer">Freezer</SelectItem>
              <SelectItem value="pantry">Pantry</SelectItem>
              <SelectItem value="spice-rack">Spice Rack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pantry Items Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Pantry Items ({filteredItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Added By</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const expiryStatus = getExpiryStatus(item.expiryDate)
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground capitalize">{item.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.location.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={expiryStatus.color as any} className="text-xs">
                            {expiryStatus.status === "expired"
                              ? `${expiryStatus.days}d ago`
                              : expiryStatus.status === "fresh"
                                ? "Fresh"
                                : `${expiryStatus.days}d left`}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.addedBy === user?.id ? "You" : item.addedBy}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PantryPage() {
  return (
    <AuthGuard>
      <PantryProvider>
        <PantryPageContent />
      </PantryProvider>
    </AuthGuard>
  )
}
