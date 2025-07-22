'use client'

import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile') // Mobile tab state
  const { user, loading, logout, updateUser } = useAuth()
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])
  
  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      }))
    }
  }, [user])
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (formData.newPassword && !formData.currentPassword) {
      toast.error('Current password is required to change password')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      }
      
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData),
        credentials: 'include'
      })
      
      const result = await response.json()
      
      if (response.ok) {
        toast.success('Profile updated successfully')
        updateUser(result.user)
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('An error occurred while updating profile')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleLogout = async () => {
    await logout()
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return null // Will redirect to login
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="container py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">My Account</span>
          </div>
          {/* Welcome message show on desktop only */}
          <div className="text-sm md:text-base font-medium text-primary hidden md:block">
            Welcome! <span className="font-semibold">Md Rimel</span>
          </div>
        </nav>
      </div>

      {/* Card with tabs */}
      <div className="container py-6 mb-10">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-4 md:p-6">

            {/* Mobile: Show buttons for tabs */}
            <div className="mb-4 md:hidden flex flex-col gap-2">
              <button
                className={`w-full p-3 rounded text-left font-semibold ${activeTab==='profile' ? 'bg-gray-300' : 'bg-gray-50'}`}
                onClick={() => setActiveTab('profile')}
              >
                My Profile
              </button>
              <button
                className={`w-full p-3 rounded text-left font-semibold ${activeTab==='address' ? 'bg-gray-300' : 'bg-gray-50'}`}
                onClick={() => setActiveTab('address')}
              >
                Address Book
              </button>
              <button
                className={`w-full p-3 rounded text-left font-semibold ${activeTab==='payment' ? 'bg-gray-300' : 'bg-gray-50'}`}
                onClick={() => setActiveTab('payment')}
              >
                Payment Options
              </button>
              <button
                className={`w-full p-3 rounded text-left font-semibold ${activeTab==='orders' ? 'bg-gray-300' : 'bg-gray-50'}`}
                onClick={() => setActiveTab('orders')}
              >
                My Orders
              </button>
              <button
                className={`w-full p-3 rounded text-left font-semibold ${activeTab==='wishlist' ? 'bg-gray-300' : 'bg-gray-50'}`}
                onClick={() => setActiveTab('wishlist')}
              >
                My Wishlist
              </button>
            </div>

            {/* Desktop: Show tab triggers and content */}
            <Tabs defaultValue="profile" className="hidden md:block">
              <TabsList className="mb-4 flex flex-wrap gap-2">
                <TabsTrigger value="profile">My Profile</TabsTrigger>
                <TabsTrigger value="address">Address Book</TabsTrigger>
                <TabsTrigger value="payment">Payment Options</TabsTrigger>
                <TabsTrigger value="orders">My Orders</TabsTrigger>
                <TabsTrigger value="wishlist">My Wishlist</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">Edit Your Profile</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        type="tel" 
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Password Changes</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Enter current password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-4">
                      <Button variant="outline" type="button" onClick={handleLogout}>Logout</Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
              
              <TabsContent value="address">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">Address Book</h2>
                  <p>Manage your shipping and billing addresses here.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="payment">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">Payment Options</h2>
                  <p>Manage your payment methods and preferences.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="orders">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">My Orders</h2>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">View and manage all your orders</p>
                    <Button asChild>
                      <Link href="/orders">View All Orders</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="wishlist">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">My Wishlist</h2>
                  <p>View and manage items in your wishlist.</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Content for mobile based on activeTab */}
            <div className="md:hidden">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">Edit Your Profile</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form fields with larger touch area and vertical layout */}
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="firstName-mobile">First Name</Label>
                        <Input 
                          id="firstName-mobile" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="mt-1" 
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName-mobile">Last Name</Label>
                        <Input 
                          id="lastName-mobile" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="mt-1" 
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="email-mobile">Email</Label>
                        <Input
                          id="email-mobile"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone-mobile">Phone</Label>
                        <Input
                          id="phone-mobile"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Password Change */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Password Changes</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword-mobile">Current Password</Label>
                          <Input
                            id="currentPassword-mobile"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Enter current password"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword-mobile">New Password</Label>
                          <Input
                            id="newPassword-mobile"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter new password"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword-mobile">Confirm New Password</Label>
                          <Input
                            id="confirmPassword-mobile"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm new password"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 mt-4">
                      <Button variant="outline" type="button" onClick={handleLogout}>Logout</Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'address' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">Address Book</h2>
                  <p>Manage your shipping and billing addresses here.</p>
                </div>
              )}

              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">Payment Options</h2>
                  <p>Manage your payment methods and preferences.</p>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">My Orders</h2>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">View and manage all your orders</p>
                    <Button asChild>
                      <Link href="/orders">View All Orders</Link>
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">My Wishlist</h2>
                  <p>View and manage items in your wishlist.</p>
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}