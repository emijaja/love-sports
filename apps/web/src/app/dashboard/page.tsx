import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { Heart, Calendar, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import EventStatusContent from './components/EventStatusContent'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  // セッションを確認
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // ユーザー情報を取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // 参加者権限確認
  if (profile?.role !== 'user') {
    redirect('/login')
  }

  // 参加中のイベントを取得
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      device_assignments!inner(participant_id)
    `)
    .eq('device_assignments.participant_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Love Sports
              </h1>
              <p className="text-sm text-gray-600">
                ようこそ、{profile?.nickname || session.user.email}さん
              </p>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="space-y-6">
          {/* プロフィール編集ボタン */}
          <div className="flex justify-end">
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <Settings className="h-4 w-4 mr-2" />
              プロフィール編集
            </Link>
          </div>

          {/* イベント情報 */}
          <div className="space-y-6">
            {!events || events.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-medium text-gray-900">参加イベント</h2>
                </div>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    参加中のイベントがありません
                  </h3>
                  <p className="text-gray-600">
                    運営者からイベントに招待されると、ここに表示されます
                  </p>
                </div>
              </div>
            ) : (
              events.map((event) => (
                <EventStatusContent key={event.id} event={event} />
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* 固定ログアウトボタン */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-full shadow-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            title="ログアウト"
          >
            <LogOut className="h-4 w-4" />
            <span>ログアウト</span>
          </button>
        </form>
      </div>
    </div>
  )
}