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
  Sparkles,
  Pencil
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

interface FlashSaleProduct {
  id: string
  productId: string
  product: {
    id: string
    name: string
    regularPrice: number
    salePrice?: number
    images: { url: string }[]
  }
  isActive: boolean
  sortOrder: number
}

interface NewArrivalSection {
  id: string
  title: string
  subtitle?: string
  description?: string
  image?: string
  bgColor: string
  textColor: string
  buttonText?: string
  buttonLink?: string
  type: 'PLAYSTATION' | 'WOMENS_COLLECTION' | 'SPEAKERS' | 'PERFUME' | 'CUSTOM'
  isActive: boolean
  sortOrder: number
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
  const [flashSaleProducts, setFlashSaleProducts] = useState<FlashSaleProduct[]>([])
  const [flashSaleEndTime, setFlashSaleEndTime] = useState<string>('')
  const [newArrivalSections, setNewArrivalSections] = useState<NewArrivalSection[]>([])
  const [activeTab, setActiveTab] = useState('general')

  // Modal states
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false)
  const [isPromotionalModalOpen, setIsPromotionalModalOpen] = useState(false)
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false)
  const [isHeadlineModalOpen, setIsHeadlineModalOpen] = useState(false)
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [isFlashSaleModalOpen, setIsFlashSaleModalOpen] = useState(false)
  const [isFeaturedSectionModalOpen, setIsFeaturedSectionModalOpen] = useState(false)
  const [isNewArrivalModalOpen, setIsNewArrivalModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [headlineForm, setHeadlineForm] = useState({
    message: '',
    type: 'INFO' as 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'SALE',
    isActive: true,
    startDate: '',
    endDate: ''
  })
  const [carouselForm, setCarouselForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    image: '',
    logoImage: '',
    bgColor: '#000000',
    textColor: '#ffffff',
    isActive: true,
    position: 'CENTER' as 'LEFT' | 'CENTER' | 'RIGHT'
  })

  const [promotionalForm, setPromotionalForm] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    position: 'MIDDLE' as 'TOP' | 'MIDDLE' | 'BOTTOM' | 'SIDEBAR',
    isActive: true,
    startDate: '',
    endDate: ''
  })

  const [featuredForm, setFeaturedForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    bgColor: '#000000',
    textColor: '#ffffff',
    buttonText: '',
    buttonLink: '',
    countdown: false,
    countdownEnd: '',
    type: 'CUSTOM' as 'MUSIC' | 'GAMING' | 'FASHION' | 'ELECTRONICS' | 'CUSTOM',
    isActive: true
  })

  const [newArrivalForm, setNewArrivalForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    bgColor: '#000000',
    textColor: '#ffffff',
    buttonText: '',
    buttonLink: '',
    type: 'PLAYSTATION' as 'PLAYSTATION' | 'WOMENS_COLLECTION' | 'SPEAKERS' | 'PERFUME' | 'CUSTOM',
    isActive: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [settingsRes, carouselRes, promotionalRes, featuredRes, headlineRes, saleRes, flashSaleRes, newArrivalRes] = await Promise.all([
        fetch('/api/home-settings'),
        fetch('/api/home-settings/carousel'),
        fetch('/api/home-settings/promotional'),
        fetch('/api/home-settings/featured'),
        fetch('/api/home-settings/headline'),
        fetch('/api/home-settings/sale'),
        fetch('/api/home-settings/flash-sale'),
        fetch('/api/home-settings/new-arrival')
      ])

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
        // Set flash sale end time if available
        if (settingsData.flashSaleEndTime) {
          setFlashSaleEndTime(new Date(settingsData.flashSaleEndTime).toISOString().slice(0, 16))
        }
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
      if (flashSaleRes.ok) {
        const flashSaleData = await flashSaleRes.json()
        setFlashSaleProducts(flashSaleData)
      }
      if (newArrivalRes.ok) {
        const newArrivalData = await newArrivalRes.json()
        setNewArrivalSections(newArrivalData)
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
      // Update flash sale end time in settings
      const updatedSettings = {
        ...settings,
        flashSaleEndTime: flashSaleEndTime ? new Date(flashSaleEndTime).toISOString() : null
      }
      
      const response = await fetch('/api/home-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      })

      if (response.ok) {
        setSettings(updatedSettings)
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

  const handleSaveCarouselBanner = async () => {
    try {
      setSaving(true)

      const bannerData = {
        title: carouselForm.title,
        subtitle: carouselForm.subtitle,
        description: carouselForm.description,
        buttonText: carouselForm.buttonText,
        buttonLink: carouselForm.buttonLink,
        image: carouselForm.image,
        logoImage: carouselForm.logoImage,
        bgColor: carouselForm.bgColor,
        textColor: carouselForm.textColor,
        isActive: carouselForm.isActive,
        position: carouselForm.position
      }

      const url = editingItem ? `/api/home-settings/carousel/${editingItem.id}` : '/api/home-settings/carousel'
      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData)
      })

      if (response.ok) {
        toast.success(`Banner ${editingItem ? 'updated' : 'created'} successfully`)
        setIsCarouselModalOpen(false)
        setEditingItem(null)
        setCarouselForm({
          title: '',
          subtitle: '',
          description: '',
          buttonText: '',
          buttonLink: '',
          image: '',
          logoImage: '',
          bgColor: '#000000',
          textColor: '#ffffff',
          isActive: true,
          position: 'CENTER'
        })
        fetchData() // Refresh the data
      } else {
        throw new Error(`Failed to ${editingItem ? 'update' : 'create'} banner`)
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      toast.error(`Failed to ${editingItem ? 'update' : 'create'} banner`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCarouselBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/home-settings/carousel/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Banner deleted successfully')
        fetchData() // Refresh the data
      } else {
        throw new Error('Failed to delete banner')
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('Failed to delete banner')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePromotionalBanner = async (form : any) => {
    try {
      setSaving(true)



      const bannerData = {
        title: form.title,
        description: form.description,
        image: form.image,
        link: form.link,
        position: form.position,
        isActive: form.isActive,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null
      }

      const url = editingItem ? `/api/home-settings/promotional/${editingItem.id}` : '/api/home-settings/promotional'
      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData)
      })

      if (response.ok) {
        toast.success(`Banner ${editingItem ? 'updated' : 'created'} successfully`)
        setIsPromotionalModalOpen(false)
        setEditingItem(null)
        setPromotionalForm({
          title: '',
          description: '',
          image: '',
          link: '',
          position: 'MIDDLE',
          isActive: true,
          startDate: '',
          endDate: ''
        })
        fetchData() // Refresh the data
      } else {
        throw new Error(`Failed to ${editingItem ? 'update' : 'create'} banner`)
      }
    } catch (error) {
      console.error('Error saving promotional banner:', error)
      toast.error(`Failed to ${editingItem ? 'update' : 'create'} banner`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePromotionalBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/home-settings/promotional/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Banner deleted successfully')
        fetchData() // Refresh the data
      } else {
        throw new Error('Failed to delete banner')
      }
    } catch (error) {
      console.error('Error deleting promotional banner:', error)
      toast.error('Failed to delete banner')
    } finally {
      setSaving(false)
    }
  }

  const handleAddFlashSaleProduct = async (productId: string) => {
    try {
      const response = await fetch('/api/home-settings/flash-sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        const newProduct = await response.json()
        setFlashSaleProducts(prev => [...prev, newProduct])
        toast.success('Product added to flash sale successfully')
      } else {
        toast.error('Failed to add product to flash sale')
      }
    } catch (error) {
      console.error('Error adding product to flash sale:', error)
      toast.error('An error occurred while adding product to flash sale')
    }
  }

  const handleDeleteFlashSaleProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/home-settings/flash-sale/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFlashSaleProducts(prev => prev.filter(product => product.id !== id))
        toast.success('Product removed from flash sale successfully')
      } else {
        toast.error('Failed to remove product from flash sale')
      }
    } catch (error) {
      console.error('Error removing product from flash sale:', error)
      toast.error('An error occurred while removing product from flash sale')
    }
  }

  const handleUpdateFlashSaleProduct = async (id: string, data: { isActive: boolean, sortOrder: number }) => {
    try {
      const response = await fetch(`/api/home-settings/flash-sale/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setFlashSaleProducts(prev => 
          prev.map(product => product.id === id ? updatedProduct : product)
        )
        toast.success('Flash sale product updated successfully')
      } else {
        toast.error('Failed to update flash sale product')
      }
    } catch (error) {
      console.error('Error updating flash sale product:', error)
      toast.error('An error occurred while updating flash sale product')
    }
  }

  const handleSaveSaleBanner = async (banner: SaleBanner) => {
    try {
      setSaving(true)

      const bannerData = {
        title: banner.title,
        description: banner.description,
        discount: banner.discount,
        image: banner.image,
        bgColor: banner.bgColor,
        textColor: banner.textColor,
        buttonText: banner.buttonText,
        buttonLink: banner.buttonLink,
        isActive: banner.isActive,
        startDate: banner.startDate ? new Date(banner.startDate).toISOString() : null,
        endDate: banner.endDate ? new Date(banner.endDate).toISOString() : null
      }

      const url = banner.id ? `/api/home-settings/sale-banner/${banner.id}` : '/api/home-settings/sale-banner'
      const method = banner.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData)
      })

      if (response.ok) {
        const updatedBanner = await response.json()
        
        if (banner.id) {
          // Update existing banner
          setSaleBanners(prev => prev.map(item => item.id === banner.id ? updatedBanner : item))
          toast.success('Sale banner updated successfully')
        } else {
          // Add new banner
          setSaleBanners(prev => [...prev, updatedBanner])
          toast.success('Sale banner created successfully')
        }
      } else {
        throw new Error(`Failed to ${banner.id ? 'update' : 'create'} sale banner`)
      }
    } catch (error) {
      console.error('Error saving sale banner:', error)
      toast.error(`Failed to ${banner.id ? 'update' : 'create'} sale banner`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSaleBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sale banner?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/home-settings/sale-banner/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Sale banner deleted successfully')
        setSaleBanners(prev => prev.filter(banner => banner.id !== id))
      } else {
        throw new Error('Failed to delete sale banner')
      }
    } catch (error) {
      console.error('Error deleting sale banner:', error)
      toast.error('Failed to delete sale banner')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFeaturedSection = async () => {
    try {
      setSaving(true)

      const sectionData = {
        title: featuredForm.title,
        subtitle: featuredForm.subtitle,
        description: featuredForm.description,
        image: featuredForm.image,
        bgColor: featuredForm.bgColor,
        textColor: featuredForm.textColor,
        buttonText: featuredForm.buttonText,
        buttonLink: featuredForm.buttonLink,
        countdown: featuredForm.countdown,
        countdownEnd: featuredForm.countdownEnd ? new Date(featuredForm.countdownEnd).toISOString() : null,
        type: featuredForm.type,
        isActive: featuredForm.isActive
      }

      const url = editingItem ? `/api/home-settings/featured/${editingItem.id}` : '/api/home-settings/featured'
      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData)
      })

      if (response.ok) {
        toast.success(`Featured section ${editingItem ? 'updated' : 'created'} successfully`)
        setIsFeaturedSectionModalOpen(false)
        setEditingItem(null)
        setFeaturedForm({
          title: '',
          subtitle: '',
          description: '',
          image: '',
          bgColor: '#000000',
          textColor: '#ffffff',
          buttonText: '',
          buttonLink: '',
          countdown: false,
          countdownEnd: '',
          type: 'CUSTOM',
          isActive: true
        })
        fetchData() // Refresh the data
      } else {
        throw new Error(`Failed to ${editingItem ? 'update' : 'create'} featured section`)
      }
    } catch (error) {
      console.error('Error saving featured section:', error)
      toast.error(`Failed to ${editingItem ? 'update' : 'create'} featured section`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteFeaturedSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this featured section?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/home-settings/featured/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Featured section deleted successfully')
        fetchData() // Refresh the data
      } else {
        throw new Error('Failed to delete featured section')
      }
    } catch (error) {
      console.error('Error deleting featured section:', error)
      toast.error('Failed to delete featured section')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNewArrival = async () => {
    try {
      setSaving(true)
      const url = editingItem ? `/api/home-settings/new-arrival/${editingItem.id}` : '/api/home-settings/new-arrival'
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newArrivalForm,
          sortOrder: editingItem ? editingItem.sortOrder : newArrivalSections.length
        })
      })

      if (response.ok) {
        toast.success(`New arrival section ${editingItem ? 'updated' : 'created'} successfully`)
        setIsNewArrivalModalOpen(false)
        setEditingItem(null)
        setNewArrivalForm({
          title: '',
          subtitle: '',
          description: '',
          image: '',
          bgColor: '#000000',
          textColor: '#ffffff',
          buttonText: '',
          buttonLink: '',
          type: 'PLAYSTATION',
          isActive: true
        })
        fetchData()
      } else {
        throw new Error(`Failed to ${editingItem ? 'update' : 'create'} new arrival section`)
      }
    } catch (error) {
      console.error('Error saving new arrival section:', error)
      toast.error(`Failed to ${editingItem ? 'update' : 'create'} new arrival section`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteNewArrival = async (id: string) => {
    if (!confirm('Are you sure you want to delete this new arrival section?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/home-settings/new-arrival/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('New arrival section deleted successfully')
        fetchData() // Refresh the data
      } else {
        throw new Error('Failed to delete new arrival section')
      }
    } catch (error) {
      console.error('Error deleting new arrival section:', error)
      toast.error('Failed to delete new arrival section')
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
    <div className="md:container mx-auto lg:p-6 space-y-6">
      <AdminNav active="Home Page Settings" />
      <div className="flex items-center justify-between p-5 flex-col gap-2 lg:flex-row">
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
        <TabsList className="grid grid-cols-7">
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
          <TabsTrigger value="new-arrival" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            New Arrival
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
                                setCarouselForm({
                                  title: banner.title,
                                  subtitle: banner.subtitle || '',
                                  description: banner.description || '',
                                  buttonText: banner.buttonText || '',
                                  buttonLink: banner.buttonLink || '',
                                  image: banner.image || '',
                                  logoImage: banner.logoImage || '',
                                  bgColor: banner.bgColor,
                                  textColor: banner.textColor,
                                  isActive: banner.isActive,
                                  position: banner.position
                                })
                                setIsCarouselModalOpen(true)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteCarouselBanner(banner.id)}
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

        {/* Other tabs would be implemented similarly */}
        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {/* <Image className="w-5 h-5" /> */}
                  Promotional Banners
                </CardTitle>
                <Button onClick={() => {
                  setPromotionalForm({
                    title: '',
                    description: '',
                    image: '',
                    link: '',
                    position: 'MIDDLE',
                    isActive: true,
                    startDate: '',
                    endDate: ''
                  })
                  setEditingItem(null)
                  setIsPromotionalModalOpen(true)
                }} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Banner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {promotionalBanners.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No promotional banners found</p>
                  <Button onClick={() => setIsPromotionalModalOpen(true)} variant="outline" className="mt-4">
                    Create your first banner
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {promotionalBanners.map((banner) => (
                    <Card key={banner.id} className="overflow-hidden">
                      <div className="relative h-32">
                        {banner.image && (
                          <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            className="object-cover"
                          />
                        )}
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
                            {banner.startDate && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {new Date(banner.startDate).toLocaleDateString()} - 
                                {banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'No end date'}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingItem(banner)
                                setPromotionalForm({
                                  title: banner.title,
                                  description: banner.description || '',
                                  image: banner.image || '',
                                  link: banner.link || '',
                                  position: banner.position,
                                  isActive: banner.isActive,
                                  startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 10) : '',
                                  endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 10) : ''
                                })
                                setIsPromotionalModalOpen(true)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeletePromotionalBanner(banner.id)}
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

        <TabsContent value="featured" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Featured Sections
                </CardTitle>
                <Button onClick={() => {
                  setFeaturedForm({
                    title: '',
                    subtitle: '',
                    description: '',
                    image: '',
                    bgColor: '#000000',
                    textColor: '#ffffff',
                    buttonText: '',
                    buttonLink: '',
                    countdown: false,
                    countdownEnd: '',
                    type: 'CUSTOM',
                    isActive: true
                  })
                  setEditingItem(null)
                  setIsFeaturedSectionModalOpen(true)
                }} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Featured Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {featuredSections.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Featured Sections</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create featured sections to highlight special content on your homepage
                  </p>
                  <Button onClick={() => {
                    setFeaturedForm({
                      title: '',
                      subtitle: '',
                      description: '',
                      image: '',
                      bgColor: '#000000',
                      textColor: '#ffffff',
                      buttonText: '',
                      buttonLink: '',
                      countdown: false,
                      countdownEnd: '',
                      type: 'CUSTOM',
                      isActive: true
                    })
                    setEditingItem(null)
                    setIsFeaturedSectionModalOpen(true)
                  }} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Featured Section
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {featuredSections.map((section) => (
                    <Card key={section.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{section.title}</h3>
                              <Badge variant={section.isActive ? 'default' : 'secondary'}>
                                {section.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline">{section.type}</Badge>
                            </div>
                            {section.subtitle && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{section.subtitle}</p>
                            )}
                            {section.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">{section.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Colors: {section.bgColor} / {section.textColor}</span>
                              {section.countdown && section.countdownEnd && (
                                <span>Countdown: {new Date(section.countdownEnd).toLocaleDateString()}</span>
                              )}
                              {section.buttonText && (
                                <span>Button: {section.buttonText}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFeaturedForm({
                                  title: section.title,
                                  subtitle: section.subtitle || '',
                                  description: section.description || '',
                                  image: section.image || '',
                                  bgColor: section.bgColor,
                                  textColor: section.textColor,
                                  buttonText: section.buttonText || '',
                                  buttonLink: section.buttonLink || '',
                                  countdown: section.countdown,
                                  countdownEnd: section.countdownEnd ? new Date(section.countdownEnd).toISOString().slice(0, 16) : '',
                                  type: section.type,
                                  isActive: section.isActive
                                })
                                setEditingItem(section)
                                setIsFeaturedSectionModalOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteFeaturedSection(section.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
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

        <TabsContent value="new-arrival" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  New Arrival Sections
                </CardTitle>
                <Button onClick={() => {
                  setNewArrivalForm({
                    title: '',
                    subtitle: '',
                    description: '',
                    image: '',
                    bgColor: '#000000',
                    textColor: '#ffffff',
                    buttonText: '',
                    buttonLink: '',
                    type: 'CUSTOM',
                    isActive: true
                  })
                  setEditingItem(null)
                  setIsNewArrivalModalOpen(true)
                }} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Arrival Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {newArrivalSections.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No New Arrival Sections</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create new arrival sections to showcase your latest products
                  </p>
                  <Button onClick={() => {
                    setNewArrivalForm({
                      title: '',
                      subtitle: '',
                      description: '',
                      image: '',
                      bgColor: '#000000',
                      textColor: '#ffffff',
                      buttonText: '',
                      buttonLink: '',
                      type: 'CUSTOM',
                      isActive: true
                    })
                    setEditingItem(null)
                    setIsNewArrivalModalOpen(true)
                  }} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First New Arrival Section
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {newArrivalSections.map((section) => (
                    <Card key={section.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{section.title}</h3>
                              <Badge variant={section.isActive ? 'default' : 'secondary'}>
                                {section.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline">{section.type}</Badge>
                            </div>
                            {section.subtitle && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{section.subtitle}</p>
                            )}
                            {section.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">{section.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Colors: {section.bgColor} / {section.textColor}</span>
                              {section.buttonText && (
                                <span>Button: {section.buttonText}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setNewArrivalForm({
                                  title: section.title,
                                  subtitle: section.subtitle || '',
                                  description: section.description || '',
                                  image: section.image || '',
                                  bgColor: section.bgColor,
                                  textColor: section.textColor,
                                  buttonText: section.buttonText || '',
                                  buttonLink: section.buttonLink || '',
                                  type: section.type,
                                  isActive: section.isActive
                                })
                                setEditingItem(section)
                                setIsNewArrivalModalOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteNewArrival(section.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
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
                            <div className={`w-3 h-3 rounded-full ${message.type === 'SUCCESS' ? 'bg-green-500' :
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

        <TabsContent value="sales" className="space-y-6">
           <Card>
             <CardHeader>
               <div className="flex items-center justify-between">
                 <CardTitle className="flex items-center gap-2">
                   <Percent className="w-5 h-5" />
                   Flash Sale Products
                 </CardTitle>
                 <Button onClick={() => setIsFlashSaleModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                   <Plus className="w-4 h-4 mr-2" />
                   Add Product
                 </Button>
               </div>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <Label htmlFor="flashSaleEndTime">Flash Sale End Time</Label>
                   <div className="flex items-center gap-2">
                     <Input
                       id="flashSaleEndTime"
                       type="datetime-local"
                       value={flashSaleEndTime}
                       onChange={(e) => setFlashSaleEndTime(e.target.value)}
                       className="w-auto"
                     />
                   </div>
                 </div>
                 
                 <div className="flex items-center space-x-2">
                   <Switch
                     id="flashSaleEnabled"
                     checked={settings?.flashSaleEnabled || false}
                     onCheckedChange={(checked) => {
                       if (settings) {
                         setSettings({ ...settings, flashSaleEnabled: checked })
                       }
                     }}
                   />
                   <Label htmlFor="flashSaleEnabled">Enable Flash Sale</Label>
                 </div>
                 
                 {flashSaleProducts.length === 0 ? (
                   <div className="text-center py-8">
                     <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                     <p className="text-gray-600 dark:text-gray-400">No flash sale products found</p>
                     <Button onClick={() => setIsFlashSaleModalOpen(true)} variant="outline" className="mt-4">
                       Add your first flash sale product
                     </Button>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     {flashSaleProducts.map((item) => (
                       <Card key={item.id} className="overflow-hidden">
                         <CardContent className="p-4">
                           <div className="flex items-center gap-4">
                             <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                               {item.product.images && item.product.images[0] ? (
                                 <Image
                                   src={item.product.images[0].url}
                                   alt={item.product.name}
                                   width={64}
                                   height={64}
                                   className="object-cover w-full h-full"
                                 />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-gray-400">
                                   <Package size={24} />
                                 </div>
                               )}
                             </div>
                             <div className="flex-1">
                               <h3 className="font-medium">{item.product.name}</h3>
                               <div className="flex items-center gap-2 mt-1">
                                 <span className="text-gray-600 line-through">
                                   Rs {item.product.regularPrice}
                                 </span>
                                 {item.product.salePrice && (
                                   <span className="text-red-600 font-medium">
                                     Rs {item.product.salePrice}
                                   </span>
                                 )}
                               </div>
                             </div>
                             <div className="flex items-center gap-2">
                               <Switch
                                 checked={item.isActive}
                                 onCheckedChange={(checked) => 
                                   handleUpdateFlashSaleProduct(item.id, { isActive: checked, sortOrder: item.sortOrder })
                                 }
                               />
                               <Button
                                 size="sm"
                                 variant="outline"
                                 className="text-red-600 hover:text-red-700"
                                 onClick={() => handleDeleteFlashSaleProduct(item.id)}
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
               </div>
             </CardContent>
           </Card>
           
           <Card>
             <CardHeader>
               <div className="flex items-center justify-between">
                 <CardTitle className="flex items-center gap-2">
                   <Tag className="w-5 h-5" />
                   Sale Banners
                 </CardTitle>
                 <Button onClick={() => {
                   setEditingItem(null)
                   setIsSaleModalOpen(true)
                 }} className="bg-blue-600 hover:bg-blue-700">
                   <Plus className="w-4 h-4 mr-2" />
                   Add Banner
                 </Button>
               </div>
             </CardHeader>
             <CardContent>
               {saleBanners.length === 0 ? (
                 <div className="text-center py-8">
                   <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                   <p className="text-gray-600 dark:text-gray-400">No sale banners found</p>
                   <Button 
                     onClick={() => {
                       setEditingItem(null)
                       setIsSaleModalOpen(true)
                     }} 
                     variant="outline" 
                     className="mt-4"
                   >
                     Add your first sale banner
                   </Button>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {saleBanners.map((banner) => (
                     <Card key={banner.id} className="overflow-hidden">
                       <CardContent className="p-4">
                         <div className="flex items-center gap-4">
                           <div 
                             className="w-16 h-16 rounded overflow-hidden flex-shrink-0 flex items-center justify-center" 
                             style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
                           >
                             {banner.image ? (
                               <Image
                                 src={banner.image}
                                 alt={banner.title}
                                 width={64}
                                 height={64}
                                 className="object-cover w-full h-full"
                               />
                             ) : (
                               <Tag size={24} />
                             )}
                           </div>
                           <div className="flex-1">
                             <h3 className="font-medium">{banner.title}</h3>
                             {banner.description && (
                               <p className="text-sm text-gray-500">{banner.description}</p>
                             )}
                             {banner.discount && (
                               <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded mt-1">
                                 {banner.discount}
                               </span>
                             )}
                           </div>
                           <div className="flex items-center gap-2">
                             <Switch
                               checked={banner.isActive}
                               onCheckedChange={(checked) => {
                                 const updatedBanner = { ...banner, isActive: checked }
                                 handleSaveSaleBanner(updatedBanner)
                               }}
                             />
                             <Button
                               size="sm"
                               variant="outline"
                               onClick={() => {
                                 setEditingItem(banner)
                                 setIsSaleModalOpen(true)
                               }}
                             >
                               <Pencil className="w-3 h-3" />
                             </Button>
                             <Button
                               size="sm"
                               variant="outline"
                               className="text-red-600 hover:text-red-700"
                               onClick={() => handleDeleteSaleBanner(banner.id)}
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
      <Dialog open={isCarouselModalOpen} onOpenChange={(open) => {
        setIsCarouselModalOpen(open)
        if (!open) {
          setEditingItem(null)
          setCarouselForm({
            title: '',
            subtitle: '',
            description: '',
            buttonText: '',
            buttonLink: '',
            image: '',
            logoImage: '',
            bgColor: '#000000',
            textColor: '#ffffff',
            isActive: true,
            position: 'CENTER'
          })
        }
      }}>
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
                <Input
                  id="title"
                  placeholder="Enter banner title"
                  value={carouselForm.title}
                  onChange={(e) => setCarouselForm({ ...carouselForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  placeholder="Enter banner subtitle"
                  value={carouselForm.subtitle}
                  onChange={(e) => setCarouselForm({ ...carouselForm, subtitle: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter banner description"
                value={carouselForm.description}
                onChange={(e) => setCarouselForm({ ...carouselForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  placeholder="Shop Now"
                  value={carouselForm.buttonText}
                  onChange={(e) => setCarouselForm({ ...carouselForm, buttonText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  placeholder="/products"
                  value={carouselForm.buttonLink}
                  onChange={(e) => setCarouselForm({ ...carouselForm, buttonLink: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={carouselForm.image}
                onChange={(e) => setCarouselForm({ ...carouselForm, image: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <Input
                  id="bgColor"
                  type="color"
                  value={carouselForm.bgColor}
                  onChange={(e) => setCarouselForm({ ...carouselForm, bgColor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <Input
                  id="textColor"
                  type="color"
                  value={carouselForm.textColor}
                  onChange={(e) => setCarouselForm({ ...carouselForm, textColor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={carouselForm.position}
                  onValueChange={(value) => setCarouselForm({ ...carouselForm, position: value as 'LEFT' | 'CENTER' | 'RIGHT' })}
                >
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
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={carouselForm.isActive}
                  onCheckedChange={(checked) => setCarouselForm({ ...carouselForm, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCarouselModalOpen(false)
              setEditingItem(null)
              setCarouselForm({
                title: '',
                subtitle: '',
                description: '',
                buttonText: '',
                buttonLink: '',
                image: '',
                logoImage: '',
                bgColor: '#000000',
                textColor: '#ffffff',
                isActive: true,
                position: 'CENTER'
              })
            }}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSaveCarouselBanner}
              disabled={saving}
            >
              {saving ? <Spinner size="sm" className="mr-2" /> : null}
              {editingItem ? 'Update' : 'Create'} Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FlashSaleProductModal
        isOpen={isFlashSaleModalOpen}
        onClose={() => setIsFlashSaleModalOpen(false)}
        onSave={handleAddFlashSaleProduct}
      />
      <SaleBannerModal
        isOpen={isSaleModalOpen}
        onClose={() => {
          setIsSaleModalOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSaveSaleBanner}
        editingItem={editingItem as SaleBanner | null}
      />
      <PromotionalBannerModal
        isOpen={isPromotionalModalOpen}
        onClose={() => {
          setIsPromotionalModalOpen(false)
          setEditingItem(null)
          // setPromotionalForm({
          //   title: '',
          //   description: '',
          //   image: '',
          //   link: '',
          //   position: 'MIDDLE',
          //   isActive: true,
          //   startDate: '',
          //   endDate: ''
          // })
        }}
        editingItem={promotionalForm as PromotionalBanner}
        onSave={handleSavePromotionalBanner}
      />
      <FeaturedSectionModal
        isOpen={isFeaturedSectionModalOpen}
        onClose={() => {
          setIsFeaturedSectionModalOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSaveFeaturedSection}
        editingItem={editingItem as FeaturedSection | null}
        form={featuredForm}
        setForm={setFeaturedForm}
      />
      <NewArrivalSectionModal
        isOpen={isNewArrivalModalOpen}
        onClose={() => {
          setIsNewArrivalModalOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSaveNewArrival}
        editingItem={editingItem as NewArrivalSection | null}
        form={newArrivalForm}
        setForm={setNewArrivalForm}
      />
    </div>
  )
}

const NewArrivalSectionModal = ({ isOpen, onClose, onSave, editingItem, form, setForm }: {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  editingItem: NewArrivalSection | null
  form: any
  setForm: (form: any) => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Edit New Arrival Section' : 'Add New Arrival Section'}
          </DialogTitle>
          <DialogDescription>
            Create engaging new arrival sections to showcase your latest products
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Enter section subtitle"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter section description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="Enter image URL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={form.bgColor}
                  onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={form.bgColor}
                  onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={form.textColor}
                  onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={form.textColor}
                  onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={form.buttonText}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={form.buttonLink}
                onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                placeholder="Enter button link"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Section Type</Label>
            <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select section type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLAYSTATION">PlayStation</SelectItem>
                <SelectItem value="WOMENS_COLLECTION">{"Women's Collection"}</SelectItem>
                <SelectItem value="SPEAKERS">Speakers</SelectItem>
                <SelectItem value="PERFUME">Perfume</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!form.title}>
            {editingItem ? 'Update' : 'Create'} Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

{/* Promotional Banner Modal */}
const PromotionalBannerModal = ({ isOpen, onClose, editingItem, onSave }: {
  isOpen: boolean
  onClose: () => void
  editingItem?: PromotionalBanner | null
  onSave: (banner: any) => void
}) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    position: 'MIDDLE' as 'TOP' | 'MIDDLE' | 'BOTTOM' | 'SIDEBAR',
    isActive: true,
    startDate: '',
    endDate: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title,
        description: editingItem.description || '',
        image: editingItem.image || '',
        link: editingItem.link || '',
        position: editingItem.position,
        isActive: editingItem.isActive,
        startDate: editingItem.startDate ? new Date(editingItem.startDate).toISOString().slice(0, 16) : '',
        endDate: editingItem.endDate ? new Date(editingItem.endDate).toISOString().slice(0, 16) : ''
      })
    }
  }, [editingItem])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    
    if (!form.image.trim()) {
      toast.error('Image URL is required')
      return
    }
    
    setSaving(true)
    onSave(form)
    setSaving(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit' : 'Add'} Promotional Banner</DialogTitle>
          <DialogDescription>
            Create a promotional banner to display on your store.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter banner description"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={form.image || ''}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                value={form.link || ''}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="/products/category"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={form.position}
                onValueChange={(value) => setForm({ ...form, position: value as 'TOP' | 'MIDDLE' | 'BOTTOM' | 'SIDEBAR' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOP">Top</SelectItem>
                  <SelectItem value="MIDDLE">Middle</SelectItem>
                  <SelectItem value="BOTTOM">Bottom</SelectItem>
                  <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date (Optional)</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={form.startDate || ''}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={form.endDate || ''}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" className="mr-2" /> : null}
              {editingItem ? 'Update' : 'Create'} Banner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const SaleBannerModal = ({ isOpen, onClose, onSave, editingItem }: {
  isOpen: boolean
  onClose: () => void
  onSave: (banner: SaleBanner) => void
  editingItem: SaleBanner | null
}) => {
  const [form, setForm] = useState<Omit<SaleBanner, 'id'> & { id?: string }>({
    title: '',
    description: '',
    discount: '',
    image: '',
    bgColor: '#f8fafc',
    textColor: '#0f172a',
    buttonText: '',
    buttonLink: '',
    isActive: true,
    startDate: '',
    endDate: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setForm({
        id: editingItem.id,
        title: editingItem.title,
        description: editingItem.description || '',
        discount: editingItem.discount || '',
        image: editingItem.image || '',
        bgColor: editingItem.bgColor,
        textColor: editingItem.textColor,
        buttonText: editingItem.buttonText || '',
        buttonLink: editingItem.buttonLink || '',
        isActive: editingItem.isActive,
        startDate: editingItem.startDate || '',
        endDate: editingItem.endDate || ''
      })
    } else {
      setForm({
        title: '',
        description: '',
        discount: '',
        image: '',
        bgColor: '#f8fafc',
        textColor: '#0f172a',
        buttonText: '',
        buttonLink: '',
        isActive: true,
        startDate: '',
        endDate: ''
      })
    }
  }, [editingItem, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const banner: SaleBanner = {
      id: form.id || '',
      title: form.title,
      description: form.description,
      discount: form.discount,
      image: form.image,
      bgColor: form.bgColor,
      textColor: form.textColor,
      buttonText: form.buttonText,
      buttonLink: form.buttonLink,
      isActive: form.isActive,
      startDate: form.startDate,
      endDate: form.endDate
    }
    
    onSave(banner)
    setSaving(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit' : 'Add'} Sale Banner</DialogTitle>
          <DialogDescription>
            Create a promotional sale banner to display on your store.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Text</Label>
              <Input
                id="discount"
                value={form.discount || ''}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                placeholder="e.g. 50% OFF"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter banner description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={form.image || ''}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={form.buttonText || ''}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                placeholder="e.g. Shop Now"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={form.buttonLink || ''}
                onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                placeholder="/products/category"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={form.bgColor}
                  onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={form.bgColor}
                  onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={form.textColor}
                  onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={form.textColor}
                  onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date (Optional)</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={form.startDate || ''}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={form.endDate || ''}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" className="mr-2" /> : null}
              {editingItem ? 'Update' : 'Create'} Banner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const FlashSaleProductModal = ({ isOpen, onClose, onSave }: {
  isOpen: boolean
  onClose: () => void
  onSave: (productId: string) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/search?search=${encodeURIComponent(searchTerm)}`)
      
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.products || [])
      } else {
        toast.error('Failed to search products')
      }
    } catch (error) {
      console.error('Error searching products:', error)
      toast.error('An error occurred while searching products')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProduct) {
      onSave(selectedProduct)
      onClose()
    } else {
      toast.error('Please select a product')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Product to Flash Sale</DialogTitle>
          <DialogDescription>
            Search and select a product to add to the flash sale.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        <div className="max-h-[300px] overflow-y-auto border rounded-md">
          {searchResults.length > 0 ? (
            <div className="divide-y">
              {searchResults.map((product) => (
                <div 
                  key={product.id} 
                  className={`p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-700 ${selectedProduct === product.id ? 'bg-gray-800' : ''}`}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <div className="w-12 h-12 rounded overflow-hidden  flex-shrink-0">
                    {product.images && product.images[0] ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <div className="text-sm text-gray-500 flex space-x-2">
                      <span>Rs {product.regularPrice}</span>
                      {product.salePrice && (
                        <span className="text-red-500">Rs {product.salePrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              {loading ? 'Searching...' : searchTerm ? 'No products found' : 'Search for products to add'}
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedProduct}>
            Add to Flash Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const FeaturedSectionModal = ({ isOpen, onClose, onSave, editingItem, form, setForm }: {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  editingItem: FeaturedSection | null
  form: any
  setForm: (form: any) => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Edit Featured Section' : 'Add Featured Section'}
          </DialogTitle>
          <DialogDescription>
            Create engaging featured sections to highlight special content on your homepage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Enter section subtitle"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter section description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="Enter image URL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={form.bgColor}
                  onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={form.bgColor}
                  onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={form.textColor}
                  onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={form.textColor}
                  onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={form.buttonText}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={form.buttonLink}
                onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                placeholder="Enter button link"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Section Type</Label>
            <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select section type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MUSIC">Music</SelectItem>
                <SelectItem value="GAMING">Gaming</SelectItem>
                <SelectItem value="FASHION">Fashion</SelectItem>
                <SelectItem value="ELECTRONICS">Electronics</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="countdown"
                checked={form.countdown}
                onChange={(e) => setForm({ ...form, countdown: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="countdown">Enable Countdown Timer</Label>
            </div>

            {form.countdown && (
              <div className="space-y-2">
                <Label htmlFor="countdownEnd">Countdown End Date</Label>
                <Input
                  id="countdownEnd"
                  type="datetime-local"
                  value={form.countdownEnd}
                  onChange={(e) => setForm({ ...form, countdownEnd: e.target.value })}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!form.title}>
            {editingItem ? 'Update' : 'Create'} Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}