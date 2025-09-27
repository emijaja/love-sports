'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { User, MessageSquare } from 'lucide-react'
import { updateProfile, uploadProfileImage } from '../actions'
import ImageUpload from './ImageUpload'

const profileSchema = z.object({
  nickname: z
    .string()
    .min(1, 'ニックネームを入力してください')
    .max(50, 'ニックネームは50文字以内で入力してください'),
  bio: z
    .string()
    .max(500, '自己紹介は500文字以内で入力してください')
    .optional()
})

type ProfileForm = z.infer<typeof profileSchema>

interface ProfileFormProps {
  profile: {
    id: string
    nickname?: string
    gender?: string
    bio?: string
    image_url?: string
  } | null
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string>('')
  const [imageUploading, setImageUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: profile?.nickname || '',
      bio: profile?.bio || ''
    }
  })

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
    setImageError('')
  }

  const handleImageUpload = async () => {
    if (!imageFile) return

    setImageUploading(true)
    setImageError('')

    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      await uploadProfileImage(formData)
      setSuccess('プロフィール画像を更新しました')
      setImageFile(null)
    } catch (err) {
      setImageError(err instanceof Error ? err.message : '画像のアップロードに失敗しました')
    } finally {
      setImageUploading(false)
    }
  }

  const onSubmit = async (data: ProfileForm) => {
    setError('')
    setSuccess('')
    
    try {
      // 画像がある場合は先にアップロード
      if (imageFile) {
        await handleImageUpload()
      }
      
      await updateProfile(data)
      setSuccess('プロフィールを更新しました')
    } catch (err) {
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        return
      }
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
          {success}
        </div>
      )}

      <ImageUpload
        currentImageUrl={profile?.image_url}
        onImageChange={handleImageChange}
        error={imageError}
      />

      {imageFile && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
          <span className="text-sm text-blue-800">
            画像が選択されました: {imageFile.name}
          </span>
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={imageUploading}
            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {imageUploading ? 'アップロード中...' : '画像をアップロード'}
          </button>
        </div>
      )}

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
          ニックネーム
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('nickname')}
            type="text"
            className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm ${
              errors.nickname
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="例: たろう"
          />
        </div>
        {errors.nickname && (
          <p className="mt-2 text-sm text-red-600">{errors.nickname.message}</p>
        )}
      </div>

      {profile?.gender && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            性別
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
            {profile.gender === 'male' ? '男性' : profile.gender === 'female' ? '女性' : profile.gender}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          自己紹介（任意）
        </label>
        <div className="relative">
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            {...register('bio')}
            rows={4}
            className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm ${
              errors.bio
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="スポーツが大好きです！よろしくお願いします。"
          />
        </div>
        {errors.bio && (
          <p className="mt-2 text-sm text-red-600">{errors.bio.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '更新中...' : '更新'}
        </button>
      </div>
    </form>
  )
}