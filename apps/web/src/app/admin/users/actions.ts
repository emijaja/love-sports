'use server'

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: FormData) {
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
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nickname = formData.get('nickname') as string
  const gender = formData.get('gender') as string
  const role = formData.get('role') as string
  
  if (!email || !password || !nickname) {
    throw new Error('必須フィールドが入力されていません')
  }
  
  // 管理者用クライアントでユーザーを作成
  const adminSupabase = createAdminSupabaseClient()
  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })
  
  if (authError) {
    console.error('Error creating user:', authError)
    throw new Error('ユーザーの作成に失敗しました: ' + authError.message)
  }
  
  if (!authData.user) {
    throw new Error('ユーザーの作成に失敗しました')
  }
  
  // プロフィール情報を追加
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      nickname,
      gender: gender || null,
      role: role || 'user'
    })
    
  if (profileError) {
    console.error('Error creating profile:', profileError)
    // プロフィール作成に失敗した場合はユーザーも削除
    await adminSupabase.auth.admin.deleteUser(authData.user.id)
    throw new Error('プロフィールの作成に失敗しました')
  }
  
  // ページを再読み込み
  revalidatePath('/admin/users')
}

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