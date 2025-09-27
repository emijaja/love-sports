'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function uploadProfileImage(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  // セッション確認
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('認証が必要です')
  }

  const file = formData.get('image') as File
  if (!file) {
    throw new Error('画像ファイルが選択されていません')
  }

  // ファイル名を生成（ユーザーIDとタイムスタンプを使用）
  const fileExt = file.name.split('.').pop()
  const fileName = `${session.user.id}_${Date.now()}.${fileExt}`
  const filePath = `profile-images/${fileName}`

  // 既存の画像があれば削除
  const { data: profile } = await supabase
    .from('profiles')
    .select('image_url')
    .eq('id', session.user.id)
    .single()

  if (profile?.image_url) {
    const oldUrlParts = profile.image_url.split('/')
    const oldPath = oldUrlParts.slice(-2).join('/') // profile-images/filename.ext
    if (oldPath && oldPath.includes('profile-images/')) {
      await supabase.storage
        .from('profile-images')
        .remove([oldPath.split('/')[1]]) // filenameのみ
    }
  }

  // 新しい画像をアップロード
  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file, {
      upsert: true
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    console.error('Upload details:', { filePath, fileSize: file.size, fileType: file.type })
    throw new Error(`画像のアップロードに失敗しました: ${uploadError.message}`)
  }

  // 公開URLを取得
  const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(filePath)

  // プロフィールのimage_urlを更新
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      image_url: publicUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.user.id)

  if (updateError) {
    console.error('Profile update error:', updateError)
    throw new Error('プロフィールの更新に失敗しました')
  }

  revalidatePath('/dashboard')
  revalidatePath('/profile')
  
  return publicUrl
}

export async function updateProfile(formData: {
  nickname: string
  bio?: string
}) {
  const supabase = await createServerSupabaseClient()

  // セッション確認
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('認証が必要です')
  }

  // プロフィール更新
  const { error } = await supabase
    .from('profiles')
    .update({
      nickname: formData.nickname,
      bio: formData.bio || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.user.id)

  if (error) {
    console.error('Profile update error:', error)
    throw new Error('プロフィールの更新に失敗しました')
  }

  revalidatePath('/dashboard')
  revalidatePath('/profile')
}