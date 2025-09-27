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

export async function assignDevice(formData: FormData) {
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
  const eventId = formData.get('eventId') as string
  const participantId = formData.get('participantId') as string
  
  if (!deviceId || !eventId || !participantId) {
    throw new Error('必須フィールドが入力されていません')
  }
  
  // デバイスが存在するか確認
  const { data: device } = await supabase
    .from('devices')
    .select('id')
    .eq('id', deviceId)
    .single()
    
  if (!device) {
    throw new Error('指定されたデバイスが見つかりません')
  }
  
  // イベントが存在し、アクティブかどうか確認
  const { data: event } = await supabase
    .from('events')
    .select('id, name, status')
    .eq('id', eventId)
    .single()
    
  if (!event) {
    throw new Error('指定されたイベントが見つかりません')
  }
  
  if (event.status === 'ended') {
    throw new Error('終了したイベントにはデバイスをアサインできません')
  }
  
  // 参加者が存在するか確認
  const { data: participant } = await supabase
    .from('profiles')
    .select('id, nickname')
    .eq('id', participantId)
    .single()
    
  if (!participant) {
    throw new Error('指定された参加者が見つかりません')
  }
  
  // 既存の割り当てをチェック
  const { data: existingAssignment } = await supabase
    .from('device_assignments')
    .select('*')
    .eq('event_id', eventId)
    .eq('device_id', deviceId)
    .single()
    
  if (existingAssignment) {
    throw new Error('このデバイスは既にこのイベントでアサインされています')
  }
  
  // 参加者が既に他のデバイスをアサインされているかチェック
  const { data: participantAssignment } = await supabase
    .from('device_assignments')
    .select('*')
    .eq('event_id', eventId)
    .eq('participant_id', participantId)
    .single()
    
  if (participantAssignment) {
    throw new Error('この参加者は既に他のデバイスがアサインされています')
  }
  
  // アサインを作成
  const { error } = await supabase
    .from('device_assignments')
    .insert({
      event_id: eventId,
      device_id: deviceId,
      participant_id: participantId
    })
    
  if (error) {
    console.error('Error assigning device:', error)
    throw new Error('デバイスのアサインに失敗しました')
  }
  
  // ページを再読み込み
  revalidatePath('/admin/devices')
}

export async function unassignDevice(formData: FormData) {
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
  
  const eventId = formData.get('eventId') as string
  const deviceId = formData.get('deviceId') as string
  
  if (!eventId || !deviceId) {
    throw new Error('必須パラメータが不足しています')
  }
  
  // アサインを削除
  const { error } = await supabase
    .from('device_assignments')
    .delete()
    .eq('event_id', eventId)
    .eq('device_id', deviceId)
    
  if (error) {
    console.error('Error unassigning device:', error)
    throw new Error('デバイスのアサイン解除に失敗しました')
  }
  
  // ページを再読み込み
  revalidatePath('/admin/devices')
}