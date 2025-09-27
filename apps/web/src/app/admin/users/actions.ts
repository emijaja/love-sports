'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  // セッション確認
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  // 管理者権限確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
    
  if (profile?.role !== 'admin') {
    redirect('/admin/login')
  }
  
  const userId = formData.get('userId') as string
  const currentRole = formData.get('currentRole') as string
  
  // 自分の権限は変更できない
  if (userId === session.user.id) {
    return
  }
  
  // 権限を切り替え
  const newRole = currentRole === 'admin' ? 'user' : 'admin'
  
  const { error } = await supabase
    .from('profiles')
    .update({ 
      role: newRole,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    
  if (error) {
    console.error('Error updating user role:', error)
    throw new Error('ユーザー権限の更新に失敗しました')
  }
  
  // ページを再読み込み
  revalidatePath('/admin/users')
}