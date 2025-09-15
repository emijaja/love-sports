import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, TrendingUp } from 'lucide-react'

interface ExcitementResultPageProps {
  params: Promise<{ id: string }>
}

export default async function ExcitementResultPage({ params }: ExcitementResultPageProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
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
            <div className="mx-auto h-16 w-16 bg-pink-200 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ドキドキ相手</h1>
            <p className="text-gray-600">誰と近くにいる時に一番ドキドキしたか</p>
            <div className="text-sm text-gray-500 mt-2">{event.name}</div>
          </div>
        </div>

        <div className="space-y-6">
          {/* メイン結果 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💕</div>
              <h2 className="text-2xl font-bold text-pink-600 mb-2">田中 太郎さん</h2>
              <p className="text-gray-600">あなたが最もドキドキした相手です</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-pink-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-pink-600">165 bpm</div>
                <div className="text-sm text-pink-700">最高心拍数</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">2.1m</div>
                <div className="text-sm text-red-700">その時の距離</div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              15:23頃に最も心拍数が上昇しました
            </div>
          </div>

          {/* 詳細データ */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              ドキドキ度分析
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>田中 太郎さん</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>佐藤 花子さん</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>山田 恵子さん</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-300 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 他の結果へのリンク */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">他の結果も見る</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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