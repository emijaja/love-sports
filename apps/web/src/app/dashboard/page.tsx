import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { Heart, User, Calendar, Trophy, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

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
          <div className="flex items-center justify-between">
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
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                title="ログアウト"
              >
                <LogOut className="h-4 w-4" />
                <span>ログアウト</span>
              </button>
            </form>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側: プロフィール情報 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3 mb-4">
                <User className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">プロフィール</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">ニックネーム</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile?.nickname || 'まだ設定されていません'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">性別</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile?.gender === 'male' ? '男性' : 
                     profile?.gender === 'female' ? '女性' : 
                     'まだ設定されていません'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">自己紹介</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile?.bio || 'まだ設定されていません'}
                  </dd>
                </div>
                <Link
                  href="/profile"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  プロフィール編集
                </Link>
              </div>
            </div>
          </div>

          {/* 右側: イベント情報 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">参加イベント</h2>
              </div>

              {!events || events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    参加中のイベントがありません
                  </h3>
                  <p className="text-gray-600">
                    運営者からイベントに招待されると、ここに表示されます
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {event.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(event.starts_at_ms).toLocaleString('ja-JP')} 〜{' '}
                            {new Date(event.ends_at_ms).toLocaleString('ja-JP')}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.status === 'preparing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : event.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : event.status === 'interval'
                                ? 'bg-blue-100 text-blue-800'
                                : event.status === 'ended'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {event.status === 'preparing'
                              ? '準備中'
                              : event.status === 'active'
                              ? '開催中'
                              : event.status === 'interval'
                              ? 'インターバル'
                              : event.status === 'ended'
                              ? '終了'
                              : '結果公開中'}
                          </span>
                        </div>
                      </div>
                      
                      {event.status === 'published' && (
                        <div className="mt-4">
                          <Link
                            href={`/results/${event.id}`}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                          >
                            <Trophy className="h-4 w-4 mr-2" />
                            結果を見る
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}