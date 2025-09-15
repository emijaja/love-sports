import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Activity, Clock } from 'lucide-react'

interface HeartRatePeakResultPageProps {
  params: Promise<{ id: string }>
}

export default async function HeartRatePeakResultPage({ params }: HeartRatePeakResultPageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  // セッションを確認
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // ユーザー権限確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'user') {
    redirect('/login')
  }

  // イベント取得
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // 参加確認
  const { data: assignment } = await supabase
    .from('device_assignments')
    .select('*')
    .eq('event_id', id)
    .eq('participant_id', session.user.id)
    .single()

  if (!assignment) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            ダッシュボードに戻る
          </Link>
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-red-200 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">最大心拍数の瞬間</h1>
            <p className="text-gray-600">最大心拍数のとき、誰が近くにいたか</p>
            <div className="text-sm text-gray-500 mt-2">{event.name}</div>
          </div>
        </div>

        <div className="space-y-6">
          {/* メイン結果 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💓</div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">鈴木 次郎さん</h2>
              <p className="text-gray-600">最大心拍数を記録した時に最も近くにいた人</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">180 bpm</div>
                <div className="text-sm text-red-700">最大心拍数</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">1.5m</div>
                <div className="text-sm text-orange-700">その時の距離</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">15:47</div>
                <div className="text-sm text-yellow-700">記録時刻</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <Clock className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">
                  この瞬間が最もエキサイティングな時間でした！
                </span>
              </div>
            </div>
          </div>

          {/* 心拍数推移 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              心拍数推移（ピーク付近）
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">15:45</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <span className="text-sm font-medium">153 bpm</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">15:46</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <span className="text-sm font-medium">165 bpm</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm text-red-600 font-medium">15:47</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-red-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-red-600">180 bpm ⭐</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">15:48</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <span className="text-sm font-medium">158 bpm</span>
              </div>
            </div>
          </div>

          {/* 他の結果へのリンク */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">他の結果も見る</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href={`/results/${id}/excitement`}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💕</div>
                  <div className="font-medium text-gray-900">ドキドキ相手</div>
                  <div className="text-sm text-gray-600">最もドキドキした相手</div>
                </div>
              </Link>
              
              <Link
                href={`/results/${id}/proximity`}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">👫</div>
                  <div className="font-medium text-gray-900">最も近くにいた人</div>
                  <div className="text-sm text-gray-600">平均距離が最も近い相手</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}