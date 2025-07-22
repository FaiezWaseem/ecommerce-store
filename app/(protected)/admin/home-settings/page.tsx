'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Settings,
  Eye,
  EyeOff,
  Save,
  Upload,
  Palette,
  Type,
  Link as LinkIcon,
  Calendar,
  Tag,
  Megaphone,
  Percent,
  Star,
  Grid3X3,
  Package,
  Users,
  ShoppingCart,
  Home,
  Sparkles
} from 'lucide-react'
import { Spinner } from '@nextui-org/react'
import Image from 'next/image'
import AdminNav from '@/components/navbar/admin-nav'

interface HomePageSettings {
  id: string
  topBannerEnabled: boolean
  topBannerText: string
  topBannerLink: string
  topBannerLinkText: string
  heroSectionEnabled: boolean
  categoriesEnabled: boolean
  flashSaleEnabled: boolean
  bestSellingEnabled: boolean
  featuredBannerEnabled: boolean
  exploreProductsEnabled: boolean
  newArrivalEnabled: boolean
  servicesEnabled: boolean
}

interface CarouselBanner {
  id: string
  title: string
  subtitle?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  image?: string
  logoImage?: string
  bgColor: string
  textColor: string
  isActive: boolean
  sortOrder: number
  position: 'LEFT' | 'CENTER' | 'RIGHT'
}

interface PromotionalBanner {
  id: string
  title: string
  description?: string
  image: string
  link?: string
  position: 'TOP' | 'MIDDLE' | 'BOTTOM' | 'SIDEBAR'
  isActive: boolean
  sortOrder: number
  startDate?: string
  endDate?: string
}

interface FeaturedSection {
  id: string
  title: string
  subtitle?: string
  description?: string
  image?: string
  bgColor: string
  textColor: string
  buttonText?: string
  buttonLink?: string
  countdown: boolean
  countdownEnd?: string
  type: 'MUSIC' | 'GAMING' | 'FASHION' | 'ELECTRONICS' | 'CUSTOM'
  isActive: boolean
  sortOrder: number
}

interface HeadlineMessage {
  id: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'SALE'
  isActive: boolean
  startDate?: string
  endDate?: string
}

interface SaleBanner {
  id: string
  title: string
  description?: string
  discount?: string
  image?: string
  bgColor: string
  textColor: string
  buttonText?: string
  buttonLink?: string
  isActive: boolean
  startDate?: string
  endDate?: string
}

export default function HomeSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<HomePageSettings | null>(null)
  const [carouselBanners, setCarouselBanners] = useState<CarouselBanner[]>([])
  const [promotionalBanners, setPromotionalBanners] = useState<PromotionalBanner[]>([])
  const [featuredSections, setFeaturedSections] = useState<FeaturedSection[]>([])
  const [headlineMessages, setHeadlineMessages] = useState<HeadlineMessage[]>([])
  const [saleBanners, setSaleBanners] = useState<SaleBanner[]>([])
  const [activeTab, setActiveTab] = useState('general')

  // Modal states
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false)
  const [isPromotionalModalOpen, setIsPromotionalModalOpen] = useState(false)
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false)
  const [isHeadlineModalOpen, setIsHeadlineModalOpen] = useState(false)
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [headlineForm, setHeadlineForm] = useState({
    message: '',
    type: 'INFO' as 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'SALE',
    isActive: true,
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [settingsRes, carouselRes, promotionalRes, featuredRes, headlineRes, saleRes] = await Promise.all([
        fetch('/api/home-settings'),
        fetch('/api/home-settings/carousel'),
        fetch('/api/home-settings/promotional'),
        fetch('/api/home-settings/featured'),
        fetch('/api/home-settings/headline'),
        fetch('/api/home-settings/sale')
      ])

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
      }
      if (carouselRes.ok) {
        const carouselData = await carouselRes.json()
        setCarouselBanners(carouselData)
      }
      if (promotionalRes.ok) {
        const promotionalData = await promotionalRes.json()
        setPromotionalBanners(promotionalData)
      }
      if (featuredRes.ok) {
        const featuredData = await featuredRes.json()
        setFeaturedSections(featuredData)
      }
      if (headlineRes.ok) {
        const headlineData = await headlineRes.json()
        setHeadlineMessages(headlineData)
      }
      if (saleRes.ok) {
        const saleData = await saleRes.json()
        setSaleBanners(saleData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load home page settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return
    
    try {
      setSaving(true)
      const response = await fetch('/api/home-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast.success('Settings saved successfully')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSectionToggle = (section: keyof HomePageSettings, value: boolean) => {
    if (!settings) return
    setSettings({ ...settings, [section]: value })
  }

  const handleSaveHeadlineMessage = async () => {
    try {
      setSaving(true)

      const messageData = {
        message: headlineForm.message,
        type: headlineForm.type,
        isActive: headlineForm.isActive,
        startDate: headlineForm.startDate ? new Date(headlineForm.startDate).toISOString() : null,
        endDate: headlineForm.endDate ? new Date(headlineForm.endDate).toISOString() : null
      }

      const url = editingItem ? `/api/home-settings/headline/${editingItem.id}` : '/api/home-settings/headline'
      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })

      if (response.ok) {
        toast.success(`Message ${editingItem ? 'updated' : 'created'} successfully`)
        setIsHeadlineModalOpen(false)
        setEditingItem(null)
        setHeadlineForm({
          message: '',
          type: 'INFO',
          isActive: true,
          startDate: '',
          endDate: ''
        })
        fetchData() // Refresh the data
      } else {
        throw new Error(`Failed to ${editingItem ? 'update' : 'create'} message`)
      }
    } catch (error) {
      console.error('Error saving message:', error)
      toast.error(`Failed to ${editingItem ? 'update' : 'create'} message`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteHeadlineMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/home-settings/headline/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Message deleted successfully')
        fetchData() // Refresh the data
      } else {
        throw new Error('Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Failed to delete message')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AdminNav active="Home Page Settings" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Home Page Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Customize your home page layout, content, and promotional elements
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          {saving ? <Spinner size="sm" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="carousel" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Carousel
          </TabsTrigger>
          <TabsTrigger value="banners" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Banners
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Sales
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Section Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings && (
                <>
                  {/* Top Banner Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-medium">Top Banner</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Show promotional banner at the top of the page
                        </p>
                      </div>
                      <Switch
                        checked={settings.topBannerEnabled}
                        onCheckedChange={(checked) => handleSectionToggle('topBannerEnabled', checked)}
                      />
                    </div>
                    {settings.topBannerEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="topBannerText">Banner Text</Label>
                          <Textarea
                            id="topBannerText"
                            value={settings.topBannerText}
                            onChange={(e) => setSettings({ ...settings, topBannerText: e.target.value })}
                            placeholder="Enter banner text"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="topBannerLink">Banner Link</Label>
                          <Input
                            id="topBannerLink"
                            value={settings.topBannerLink}
                            onChange={(e) => setSettings({ ...settings, topBannerLink: e.target.value })}
                            placeholder="Enter link URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="topBannerLinkText">Link Text</Label>
                          <Input
                            id="topBannerLinkText"
                            value={settings.topBannerLinkText}
                            onChange={(e) => setSettings({ ...settings, topBannerLinkText: e.target.value })}
                            placeholder="Enter link text"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Section Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { key: 'heroSectionEnabled', label: 'Hero Carousel', icon: ImageIcon, description: 'Main carousel banner section' },
                      { key: 'categoriesEnabled', label: 'Categories', icon: Grid3X3, description: 'Browse by category section' },
                      { key: 'flashSaleEnabled', label: 'Flash Sale', icon: Percent, description: 'Flash sale countdown section' },
                      { key: 'bestSellingEnabled', label: 'Best Selling', icon: Star, description: 'Best selling products section' },
                      { key: 'featuredBannerEnabled', label: 'Featured Banner', icon: Sparkles, description: 'Middle promotional banners' },
                      { key: 'exploreProductsEnabled', label: 'Explore Products', icon: Package, description: 'Product exploration section' },
                      { key: 'newArrivalEnabled', label: 'New Arrivals', icon: Plus, description: 'New arrival showcase section' },
                      { key: 'servicesEnabled', label: 'Services', icon: Users, description: 'Service highlights section' }
                    ].map((section) => {
                      const Icon = section.icon
                      return (
                        <div key={section.key} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-blue-600" />
                            <div>
                              <Label className="text-base font-medium">{section.label}</Label>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={settings[section.key as keyof HomePageSettings] as boolean}
                            onCheckedChange={(checked) => handleSectionToggle(section.key as keyof HomePageSettings, checked)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Carousel Banners Tab */}
        <TabsContent value="carousel" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Carousel Banners
                </CardTitle>
                <Button onClick={() => setIsCarouselModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Banner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {carouselBanners.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No carousel banners found</p>
                  <Button onClick={() => setIsCarouselModalOpen(true)} variant="outline" className="mt-4">
                    Create your first banner
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {carouselBanners.map((banner) => (
                    <Card key={banner.id} className="overflow-hidden">
                      <div className="relative h-32" style={{ backgroundColor: banner.bgColor }}>
                        {banner.image && (
                          <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            className="object-cover opacity-75"
                          />
                        )}
                        <div className="absolute inset-0 p-4 flex flex-col justify-center" style={{ color: banner.textColor }}>
                          <h3 className="font-bold text-sm truncate">{banner.title}</h3>
                          {banner.subtitle && <p className="text-xs truncate">{banner.subtitle}</p>}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Badge variant={banner.isActive ? 'default' : 'secondary'} className="text-xs">
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{banner.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Position: {banner.position}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingItem(banner)
                                setIsCarouselModalOpen(true)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would be implemented similarly */}
        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <CardTitle>Promotional Banners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">Promotional banners management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <Card>
            <CardHeader>
              <CardTitle>Featured Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">Featured sections management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5" />
                  Headline Messages
                </CardTitle>
                <Button onClick={() => {
                   setHeadlineForm({
                     message: '',
                     type: 'INFO',
                     isActive: true,
                     startDate: '',
                     endDate: ''
                   })
                   setEditingItem(null)
                   setIsHeadlineModalOpen(true)
                 }} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Message
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {headlineMessages.length === 0 ? (
                <div className="text-center py-8">
                  <Megaphone className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No headline messages found</p>
                  <Button onClick={() => {
                     setHeadlineForm({
                       message: '',
                       type: 'INFO',
                       isActive: true,
                       startDate: '',
                       endDate: ''
                     })
                     setEditingItem(null)
                     setIsHeadlineModalOpen(true)
                   }} variant="outline" className="mt-4">
                    Create your first message
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {headlineMessages.map((message) => (
                    <Card key={message.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              message.type === 'SUCCESS' ? 'bg-green-500' :
                              message.type === 'WARNING' ? 'bg-yellow-500' :
                              message.type === 'ERROR' ? 'bg-red-500' :
                              message.type === 'SALE' ? 'bg-purple-500' :
                              'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className="font-medium">{message.message}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <Badge variant={message.type === 'SALE' ? 'destructive' : 'secondary'} className="text-xs">
                                  {message.type}
                                </Badge>
                                <Badge variant={message.isActive ? 'default' : 'secondary'} className="text-xs">
                                  {message.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                {message.startDate && (
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    From: {new Date(message.startDate).toLocaleDateString()}
                                  </span>
                                )}
                                {message.endDate && (
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    To: {new Date(message.endDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingItem(message)
                                setHeadlineForm({
                                  message: message.message,
                                  type: message.type,
                                  isActive: message.isActive,
                                  startDate: message.startDate ? new Date(message.startDate).toISOString().slice(0, 16) : '',
                                  endDate: message.endDate ? new Date(message.endDate).toISOString().slice(0, 16) : ''
                                })
                                setIsHeadlineModalOpen(true)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteHeadlineMessage(message.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sale Banners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">Sale banners management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Headline Message Modal */}
      <Dialog open={isHeadlineModalOpen} onOpenChange={setIsHeadlineModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} Headline Message</DialogTitle>
            <DialogDescription>
              Create or edit a headline message for your home page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
               <Label htmlFor="message">Message</Label>
               <Textarea 
                 id="message" 
                 placeholder="Enter your headline message" 
                 value={headlineForm.message}
                 onChange={(e) => setHeadlineForm({ ...headlineForm, message: e.target.value })}
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="messageType">Message Type</Label>
                 <Select value={headlineForm.type} onValueChange={(value) => setHeadlineForm({ ...headlineForm, type: value as any })}>
                   <SelectTrigger>
                     <SelectValue placeholder="Select message type" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="INFO">Info</SelectItem>
                     <SelectItem value="SUCCESS">Success</SelectItem>
                     <SelectItem value="WARNING">Warning</SelectItem>
                     <SelectItem value="ERROR">Error</SelectItem>
                     <SelectItem value="SALE">Sale</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label className="flex items-center gap-2">
                   <Switch 
                     checked={headlineForm.isActive} 
                     onCheckedChange={(checked) => setHeadlineForm({ ...headlineForm, isActive: checked })}
                   />
                   Active
                 </Label>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="startDate">Start Date (Optional)</Label>
                 <Input 
                   id="startDate" 
                   type="datetime-local" 
                   value={headlineForm.startDate}
                   onChange={(e) => setHeadlineForm({ ...headlineForm, startDate: e.target.value })}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="endDate">End Date (Optional)</Label>
                 <Input 
                   id="endDate" 
                   type="datetime-local" 
                   value={headlineForm.endDate}
                   onChange={(e) => setHeadlineForm({ ...headlineForm, endDate: e.target.value })}
                 />
               </div>
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
               setIsHeadlineModalOpen(false)
               setEditingItem(null)
               setHeadlineForm({
                 message: '',
                 type: 'INFO',
                 isActive: true,
                 startDate: '',
                 endDate: ''
               })
             }}>
              Cancel
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSaveHeadlineMessage}
            >
              {editingItem ? 'Update' : 'Create'} Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Carousel Banner Modal */}
      <Dialog open={isCarouselModalOpen} onOpenChange={setIsCarouselModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} Carousel Banner</DialogTitle>
            <DialogDescription>
              Create or edit a carousel banner for your home page hero section.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter banner title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" placeholder="Enter banner subtitle" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter banner description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input id="buttonText" placeholder="Shop Now" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input id="buttonLink" placeholder="/products" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <Input id="bgColor" type="color" defaultValue="#000000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <Input id="textColor" type="color" defaultValue="#ffffff" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LEFT">Left</SelectItem>
                    <SelectItem value="CENTER">Center</SelectItem>
                    <SelectItem value="RIGHT">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCarouselModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              {editingItem ? 'Update' : 'Create'} Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}