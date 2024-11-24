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
import { useState } from "react"

export default function AccountPage() {


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
                    <div className="text-sm">
                        Welcome! <span className="text-primary">Md Rimel</span>
                    </div>
                </nav>
            </div>

            <div className="container py-6">

                <Card>
                    <CardContent className="p-6">
                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="mb-4 flex flex-wrap gap-2">
                                <TabsTrigger value="profile">My Profile</TabsTrigger>
                                <TabsTrigger value="address">Address Book</TabsTrigger>
                                <TabsTrigger value="payment">Payment Options</TabsTrigger>
                                <TabsTrigger value="orders">My Orders</TabsTrigger>
                                <TabsTrigger value="wishlist">My Wishlist</TabsTrigger>
                            </TabsList>
                            <TabsContent value="profile">
                                <h2 className="text-2xl font-bold text-primary mb-6">Edit Your Profile</h2>
                                <form className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" defaultValue="Md" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" defaultValue="Rimel" />
                                        </div>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                defaultValue="rimel1111@gmail.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                defaultValue="Kingston, 5236, United State"
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Password Changes</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="currentPassword">Current Password</Label>
                                                <Input
                                                    id="currentPassword"
                                                    type="password"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">New Password</Label>
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button variant="outline">Cancel</Button>
                                        <Button>Save Changes</Button>
                                    </div>
                                </form>
                            </TabsContent>
                            <TabsContent value="address">
                                <h2 className="text-2xl font-bold text-primary mb-6">Address Book</h2>
                                <p>Manage your shipping and billing addresses here.</p>
                                {/* Add address management form or list here */}
                            </TabsContent>
                            <TabsContent value="payment">
                                <h2 className="text-2xl font-bold text-primary mb-6">Payment Options</h2>
                                <p>Manage your payment methods and preferences.</p>
                                {/* Add payment methods management here */}
                            </TabsContent>
                            <TabsContent value="orders">
                                <h2 className="text-2xl font-bold text-primary mb-6">My Orders</h2>
                                <p>View and manage your order history.</p>
                                {/* Add order history list or table here */}
                            </TabsContent>
                            <TabsContent value="wishlist">
                                <h2 className="text-2xl font-bold text-primary mb-6">My Wishlist</h2>
                                <p>View and manage items in your wishlist.</p>
                                {/* Add wishlist items grid or list here */}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}
