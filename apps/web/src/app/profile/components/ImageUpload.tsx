'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageChange: (file: File | null) => void
  error?: string
}

export default function ImageUpload({ currentImageUrl, onImageChange, error }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB制限
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      onImageChange(file)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        プロフィール画像
      </label>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="プロフィール画像"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera className="h-8 w-8 text-gray-400" />
            )}
          </div>
          
          {previewUrl && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            type="button"
            onClick={handleUploadClick}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            {previewUrl ? '画像を変更' : '画像をアップロード'}
          </button>
          
          <p className="text-xs text-gray-500">
            JPG、PNG形式（最大5MB）
          </p>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}