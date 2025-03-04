"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Package, Heart, CreditCard, Settings, LogOut, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-muted-foreground">john.doe@example.com</p>
            </div>
          </div>

          <Separator />

          <nav className="space-y-1">
            <Link href="/account">
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Link href="/account/orders">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Orders
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="ghost" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
            </Link>
            <Link href="/account/payment">
              <Button variant="ghost" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Methods
              </Button>
            </Link>
            <Link href="/account/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div>
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="bg-card rounded-xl border p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="(123) 456-7890" disabled={!isEditing} />
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6">
                    <Button>Save Changes</Button>
                  </div>
                )}
              </div>

              <div className="bg-card rounded-xl border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Password</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="Enter your current password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Enter your new password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm your new password" />
                  </div>

                  <Button>Update Password</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="addresses" className="space-y-6">
              <div className="bg-card rounded-xl border p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Shipping Addresses</h2>
                  <Button>Add New Address</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 relative">
                    <div className="absolute top-2 right-2 space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>

                    <div className="pt-4">
                      <p className="font-medium">Home</p>
                      <p className="text-sm text-muted-foreground mt-1">John Doe</p>
                      <p className="text-sm text-muted-foreground">123 Main St</p>
                      <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                      <p className="text-sm text-muted-foreground">United States</p>
                      <p className="text-sm text-muted-foreground">(123) 456-7890</p>

                      <div className="mt-4">
                        <Badge variant="outline">Default</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 relative">
                    <div className="absolute top-2 right-2 space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>

                    <div className="pt-4">
                      <p className="font-medium">Work</p>
                      <p className="text-sm text-muted-foreground mt-1">John Doe</p>
                      <p className="text-sm text-muted-foreground">456 Business Ave</p>
                      <p className="text-sm text-muted-foreground">New York, NY 10002</p>
                      <p className="text-sm text-muted-foreground">United States</p>
                      <p className="text-sm text-muted-foreground">(123) 456-7890</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="bg-card rounded-xl border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Communication Preferences</h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="marketing" />
                    <Label htmlFor="marketing">Receive marketing emails</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="newsletter" defaultChecked />
                    <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="orderUpdates" defaultChecked />
                    <Label htmlFor="orderUpdates">Order status updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="productUpdates" />
                    <Label htmlFor="productUpdates">Product updates and announcements</Label>
                  </div>

                  <Button className="mt-2">Save Preferences</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

