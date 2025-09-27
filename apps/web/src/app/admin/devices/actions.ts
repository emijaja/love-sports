'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function addDevice(formData: FormData) {
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
  
  const deviceId = formData.get('deviceId') as string
  const note = formData.get('note') as string
  
  if (!deviceId) {
    throw new Error('デバイスIDが入力されていません')
  }
  
  // デバイスIDの重複確認
  const { data: existingDevice } = await supabase
    .from('devices')
    .select('id')
    .eq('id', deviceId)
    .single()
    
  if (existingDevice) {
    throw new Error('このデバイスIDは既に登録されています')
  }
  
  // デバイスを追加
  const { error } = await supabase
    .from('devices')
    .insert({
      id: deviceId,
      note: note || null
    })
    
  if (error) {
    console.error('Error adding device:', error)
    throw new Error('デバイスの追加に失敗しました')
  }
  
  // ページを再読み込み
  revalidatePath('/admin/devices')
}

export async function deleteDevice(formData: FormData) {
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
  
  const deviceId = formData.get('deviceId') as string
  
  if (!deviceId) {
    throw new Error('デバイスIDが指定されていません')
  }
  
  // アクティブな割り当てがないか確認
  const { data: activeAssignments } = await supabase
    .from('device_assignments')
    .select(`
      *,
      events:events(status)
    `)
    .eq('device_id', deviceId)
  
  const hasActiveAssignments = activeAssignments?.some(assignment => 
    assignment.events && ['preparing', 'active', 'interval'].includes(assignment.events.status)
  )
  
  if (hasActiveAssignments) {
    throw new Error('アクティブなイベントに割り当てられているデバイスは削除できません')
  }
  
  // デバイスを削除（関連する割り当ても削除される）
  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', deviceId)
    
  if (error) {
    console.error('Error deleting device:', error)
    throw new Error('デバイスの削除に失敗しました')
  }
  
  // ページを再読み込み
  revalidatePath('/admin/devices')
}