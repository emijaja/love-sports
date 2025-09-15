'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateEventStatus(eventId: string, status: string) {
  const supabase = await createServerSupabaseClient()

  // セッション確認
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('認証が必要です')
  }

  // 管理者権限確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('管理者権限が必要です')
  }

  // ステータス更新
  const { error } = await supabase
    .from('events')
    .update({ status })
    .eq('id', eventId)

  if (error) {
    console.error('Status update error:', error)
    throw new Error('ステータスの更新に失敗しました')
  }

  revalidatePath('/admin/events')
}

export async function createEvent(formData: {
  name: string
  startsAtMs: number
  endsAtMs: number
}) {
  const supabase = await createServerSupabaseClient()

  // セッション確認
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('認証が必要です')
  }

  // 管理者権限確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('管理者権限が必要です')
  }

  // イベント作成
  const { data, error } = await supabase
    .from('events')
    .insert({
      name: formData.name,
      starts_at_ms: formData.startsAtMs,
      ends_at_ms: formData.endsAtMs,
      status: 'preparing'
    })
    .select()
    .single()

  if (error) {
    console.error('Event creation error:', error)
    throw new Error('イベントの作成に失敗しました')
  }

  revalidatePath('/admin/events')
  redirect('/admin/events')
}

export async function updateEvent(eventId: string, formData: {
  name: string
  startsAtMs: number
  endsAtMs: number
}) {
  const supabase = await createServerSupabaseClient()

  // セッション確認
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('認証が必要です')
  }

  // 管理者権限確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('管理者権限が必要です')
  }

  // イベント更新
  const { error } = await supabase
    .from('events')
    .update({
      name: formData.name,
      starts_at_ms: formData.startsAtMs,
      ends_at_ms: formData.endsAtMs
    })
    .eq('id', eventId)

  if (error) {
    console.error('Event update error:', error)
    throw new Error('イベントの更新に失敗しました')
  }

  revalidatePath('/admin/events')
  redirect('/admin/events')
}