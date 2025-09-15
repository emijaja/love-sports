import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, MapPin } from 'lucide-react'

interface ProximityResultPageProps {
  params: Promise<{ id: string }>
}

export default async function ProximityResultPage({ params }: ProximityResultPageProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
            <div className="mx-auto h-16 w-16 bg-blue-200 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">最も近くにいた人</h1>
            <p className="text-gray-600">もっとも近くにいた人</p>
            <div className="text-sm text-gray-500 mt-2">{event.name}</div>
          </div>
        </div>

        <div className="space-y-6">
          {/* メイン結果 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">👫</div>
              <h2 className="text-2xl font-bold text-blue-600 mb-2">高橋 美咲さん</h2>
              <p className="text-gray-600">イベント中に最も長時間近くにいた人</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">2.3m</div>
                <div className="text-sm text-blue-700">平均距離</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">42分</div>
                <div className="text-sm text-purple-700">近接時間</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">0.8m</div>
                <div className="text-sm text-indigo-700">最短距離</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  自然な距離感で一緒に行動していました
                </span>
              </div>
            </div>
          </div>

          {/* 距離推移グラフ */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              距離の変化
            </h3>
            
            <div className="space-y-3">
              <div className="text-xs text-gray-500 mb-2">時間経過による距離の変化（サンプル）</div>
              
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-xs text-gray-600">開始直後</span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-blue-400 h-1 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <span className="text-xs font-medium">3.5m</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-xs text-gray-600">中盤</span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-blue-600 h-1 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <span className="text-xs font-medium">2.2m</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-200">
                <span className="text-xs text-purple-600 font-medium">最接近</span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '16%' }}></div>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-600">0.8m ⭐</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-xs text-gray-600">終盤</span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <span className="text-xs font-medium">2.5m</span>
              </div>
            </div>
          </div>

          {/* 近接ランキング */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">近接度ランキング</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                  <span className="font-medium">高橋 美咲さん</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">2.3m</div>
                  <div className="text-xs text-blue-700">42分間</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                  <span className="font-medium">伊藤 健一さん</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-600">3.1m</div>
                  <div className="text-xs text-gray-500">28分間</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                  <span className="font-medium">山田 恵子さん</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-600">4.2m</div>
                  <div className="text-xs text-gray-500">15分間</div>
                </div>
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
                href={`/results/${id}/heartrate-peak`}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💓</div>
                  <div className="font-medium text-gray-900">最大心拍数の時</div>
                  <div className="text-sm text-gray-600">誰が近くにいたか</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}