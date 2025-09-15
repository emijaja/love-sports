'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: {
  nickname: string
  gender: 'male' | 'female'
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
      gender: formData.gender,
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