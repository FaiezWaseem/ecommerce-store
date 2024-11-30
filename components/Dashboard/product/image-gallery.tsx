'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, ChevronUp, Download, ImageIcon, Plus, Upload, Video, X, LinkIcon } from 'lucide-react'
import Image from "next/image"
import { useState, useCallback } from "react"
import { useDropzone } from 'react-dropzone'

type ImageType = {
  id: string;
  src: string;
  selected: boolean;
};

export default function ImageGallery() {
  const [attributes, setAttributes] = useState<string[]>([])
  const [linkedProducts, setLinkedProducts] = useState<string[]>([])
  const [galleryImages, setGalleryImages] = useState<ImageType[]>([])
  const [isVirtual, setIsVirtual] = useState(false)
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [featuredVideoType, setFeaturedVideoType] = useState<'upload' | 'link'>('upload')
  const [featuredVideoLink, setFeaturedVideoLink] = useState('')
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)
  const [imageLink, setImageLink] = useState('')

  const addAttribute = () => {
    setAttributes([...attributes, ''])
  }

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  const addLinkedProduct = () => {
    setLinkedProducts([...linkedProducts, ''])
  }

  const removeLinkedProduct = (index: number) => {
    setLinkedProducts(linkedProducts.filter((_, i) => i !== index))
  }

  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setMainImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setGalleryImages((prevImages) => [
          ...prevImages,
          { id: Date.now().toString(), src: e.target?.result as string, selected: false }
        ])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const toggleImageSelection = (id: number) => {
    setGalleryImages(galleryImages.map((img , index) => 
      index === id ? { ...img, selected: !img.selected } : img
    ))
  }

  const addImageFromLink = () => {
    if (imageLink) {
      setGalleryImages([
        ...galleryImages,
        { id: crypto.randomUUID() , src: imageLink, selected: false }
      ])
      setImageLink('')
    }
  }

  const removeImage = (id: number) => {
    setGalleryImages(galleryImages.filter((img , index) => index !== id))
  }

  return (

        <div >
          <div className="space-y-2">
            <Label>Main Product Image (500x500)</Label>
            <div className="flex items-center justify-center w-full">
              {mainImage ? (
                <div className="relative w-[250px] h-[250px]">
                  <Image
                    src={mainImage}
                    alt="Main product image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setMainImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="main-image-upload" className="flex flex-col items-center justify-center w-[250px] h-[250px] border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG or GIF (500x500px)</p>
                  </div>
                  <Input id="main-image-upload" type="file" className="hidden" onChange={handleMainImageUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Images Gallery</Label>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {galleryImages.filter(img => img.selected).map((image , index) => (
                <div key={image.id} className="relative aspect-square border rounded-md overflow-hidden">
                  <Image
                    src={image.src}
                    alt="Gallery image"
                    layout="fill"
                    objectFit="cover"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="aspect-square flex flex-col items-center justify-center"
                  >
                    <Plus className="h-8 w-8 mb-2" />
                    <span>Add Images</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] w-full h-[90vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Image Gallery</DialogTitle>
                    <DialogDescription>
                      Drag and drop images, paste a link, or select from existing images.{""}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-4">
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-4 text-center flex justify-center items-center cursor-pointer min-h-[30vh] ${
                          isDragActive ? 'border-primary' : 'border-gray-300'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <p>{"Drag 'n' drop some files here, or click to select files"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="Paste image URL"
                          value={imageLink}
                          onChange={(e) => setImageLink(e.target.value)}
                        />
                        <Button onClick={addImageFromLink}>
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleryImages.map((image , index) => (
                          <div
                            key={index}
                            className={`relative aspect-square border rounded-md overflow-hidden cursor-pointer ${
                              image.selected ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => toggleImageSelection(index)}
                          >
                            <Image
                              src={image.src}
                              alt="Gallery image"
                              layout="fill"
                              objectFit="cover"
                            />
                            {image.selected && (
                              <div className="absolute inset-0 bg-primary bg-opacity-20 flex items-center justify-center">
                                <Checkbox checked={true} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsGalleryModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsGalleryModalOpen(false)}>
                      Add Selected Images
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Featured Video</Label>
            <div className="space-y-2">
              <RadioGroup defaultValue="upload" onValueChange={(value) => setFeaturedVideoType(value as 'upload' | 'link')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="video-upload" />
                  <Label htmlFor="video-upload">Upload Video</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="link" id="video-link" />
                  <Label htmlFor="video-link">Video Link</Label>
                </div>
              </RadioGroup>
            </div>
            {featuredVideoType === 'upload' ? (
              <div className="flex items-center space-x-2">
                <Input id="video-file" type="file" accept="video/*" className="flex-1" />
                <Button type="button" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Input
                type="url"
                placeholder="Enter YouTube, Facebook, or Vimeo URL"
                value={featuredVideoLink}
                onChange={(e) => setFeaturedVideoLink(e.target.value)}
              />
            )}
          </div>
        </div>
  )
}

