
'use client'
import { useState, useEffect } from 'react'
import AdminNav from "@/components/navbar/admin-nav"
import { Card, CardHeader, CardBody, Spinner, Progress } from "@nextui-org/react"
import { Overview } from "@/components/graph";
import { AiFillDollarCircle } from "react-icons/ai";
import { CiCreditCard1 } from "react-icons/ci";
import { FiPackage, FiUsers, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { BsBoxSeam, BsCart3 } from "react-icons/bs";
import { HiOutlineShoppingBag } from "react-icons/hi";

import Link from "next/link"
import { ArrowUpRight, Calendar, DollarSign, Package, ShoppingCart, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"


interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  revenueChange: number
  ordersChange: number
  productsChange: number
  usersChange: number
}

interface RecentOrder {
  id: string
  customerName: string
  customerEmail: string
  amount: number
  status: string
  createdAt: string
}

export default function AdminHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard statistics
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/recent-orders')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      } else {
        // Fallback to mock data if API doesn't exist yet
        setStats({
          totalRevenue: 45231.89,
          totalOrders: 2350,
          totalProducts: 156,
          totalUsers: 1247,
          revenueChange: 20.1,
          ordersChange: 15.3,
          productsChange: 8.2,
          usersChange: 12.5
        })
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setRecentOrders(ordersData)
      } else {
        // Fallback to mock data
        setRecentOrders([
          {
            id: '1',
            customerName: 'Liam Johnson',
            customerEmail: 'liam@example.com',
            amount: 250.00,
            status: 'completed',
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            customerName: 'Olivia Smith',
            customerEmail: 'olivia@example.com',
            amount: 150.00,
            status: 'pending',
            createdAt: '2024-01-14T15:45:00Z'
          },
          {
            id: '3',
            customerName: 'Noah Williams',
            customerEmail: 'noah@example.com',
            amount: 350.00,
            status: 'completed',
            createdAt: '2024-01-13T09:20:00Z'
          },
          {
            id: '4',
            customerName: 'Emma Brown',
            customerEmail: 'emma@example.com',
            amount: 450.00,
            status: 'completed',
            createdAt: '2024-01-12T14:10:00Z'
          }
        ])
      }

      // Generate chart data for the last 12 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentMonth = new Date().getMonth()
      const chartDataGenerated = months.map((month, index) => ({
        name: month,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 200) + 50
      }))
      setChartData(chartDataGenerated)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'danger'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
        <AdminNav active="Dashboard" />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Spinner size="lg" className="mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <AdminNav active="Dashboard" />
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                {"Welcome back! Here's what's happening with your store today."}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            change={stats?.revenueChange || 0}
            icon={<DollarSign className="h-5 w-5" />}
            color="text-green-600"
          />
          <StatsCard
            title="Total Orders"
            value={(stats?.totalOrders || 0).toLocaleString()}
            change={stats?.ordersChange || 0}
            icon={<ShoppingCart className="h-5 w-5" />}
            color="text-blue-600"
          />
          <StatsCard
            title="Products"
            value={(stats?.totalProducts || 0).toLocaleString()}
            change={stats?.productsChange || 0}
            icon={<Package className="h-5 w-5" />}
            color="text-purple-600"
          />
          <StatsCard
            title="Total Users"
            value={(stats?.totalUsers || 0).toLocaleString()}
            change={stats?.usersChange || 0}
            icon={<Users className="h-5 w-5" />}
            color="text-orange-600"
          />
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="xl:col-span-2 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly revenue and orders</p>
                </div>
                <Badge variant="outline" className="w-fit">
                  Last 12 months
                </Badge>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <Overview data={chartData} />
            </CardBody>
          </Card>

          {/* Recent Orders */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Latest customer orders</p>
                </div>
                <Link 
             
                  href="/admin/orders" 
                  className="text-blue-600 hover:text-blue-700"
                >
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {order.customerEmail}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order.amount)}
                      </p>
                      <Badge 
                        color={getStatusColor(order.status) as any}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your store efficiently</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <QuickActionCard
                title="Add Product"
                icon={<Package className="h-6 w-6" />}
                href="/admin/products/create"
                color="bg-blue-500"
              />
              <QuickActionCard
                title="View Orders"
                icon={<ShoppingCart className="h-6 w-6" />}
                href="/admin/orders"
                color="bg-green-500"
              />
              <QuickActionCard
                title="Manage Users"
                icon={<Users className="h-6 w-6" />}
                href="/admin/users"
                color="bg-purple-500"
              />
              <QuickActionCard
                title="Categories"
                icon={<BsBoxSeam className="h-6 w-6" />}
                href="/admin/category"
                color="bg-orange-500"
              />
              <QuickActionCard
                title="Analytics"
                icon={<FiTrendingUp className="h-6 w-6" />}
                href="/admin/analytics"
                color="bg-pink-500"
              />
              <QuickActionCard
                title="Settings"
                icon={<Calendar className="h-6 w-6" />}
                href="/admin/settings"
                color="bg-gray-500"
              />
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  )
}


// Stats Card Component
interface StatsCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color: string
}

function StatsCard({ title, value, change, icon, color }: StatsCardProps) {
  const isPositive = change >= 0
  
  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {value}
            </p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <FiTrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <FiTrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? '+' : ''}{change.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                from last month
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
            <div className={color}>
              {icon}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

// Quick Action Card Component
interface QuickActionCardProps {
  title: string
  icon: React.ReactNode
  href: string
  color: string
}

function QuickActionCard({ title, icon, href, color }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <CardBody className="p-4 text-center">
          <div className={`${color} text-white rounded-full p-3 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 w-fit`}>
            {icon}
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </p>
        </CardBody>
      </Card>
    </Link>
  )
}
