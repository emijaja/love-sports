import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import EventForm from '../components/EventForm'

export default async function NewEventPage() {
  const supabase = await createServerSupabaseClient()

  // セッションを確認
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">新規イベント作成</h1>
          <p className="mt-2 text-gray-600">新しいスポーツイベントを作成します</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <EventForm />
        </div>
      </div>
    </div>
  )
}