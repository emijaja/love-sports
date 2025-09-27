import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, TrendingUp } from 'lucide-react'
import { ExcitementMainResult } from './excitement-main-result'
import { ExcitementDetails } from './excitement-details'
import { ExcitementAnalysis } from './excitement-analysis'

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 relative overflow-hidden">
      {/* 浮遊するハートのアニメーション */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-300 animate-bounce text-2xl opacity-60">💖</div>
        <div className="absolute top-32 right-16 text-rose-300 animate-pulse text-xl opacity-50">💕</div>
        <div className="absolute top-64 left-1/4 text-pink-200 animate-bounce text-lg opacity-40" style={{animationDelay: '1s'}}>💗</div>
        <div className="absolute bottom-32 right-1/3 text-red-300 animate-pulse text-xl opacity-50" style={{animationDelay: '2s'}}>💓</div>
        <div className="absolute bottom-20 left-16 text-pink-400 animate-bounce text-lg opacity-60" style={{animationDelay: '0.5s'}}>💘</div>
        <div className="absolute top-1/2 right-10 text-rose-200 animate-pulse text-2xl opacity-40" style={{animationDelay: '1.5s'}}>💝</div>
        <div className="absolute top-1/3 left-1/3 text-pink-300 animate-bounce text-lg opacity-50" style={{animationDelay: '2.5s'}}>💞</div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-pink-600 hover:text-pink-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            ダッシュボードに戻る
          </Link>
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
              <Heart className="h-10 w-10 text-white fill-current" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
              ドキドキ相手 💕
            </h1>
            <p className="text-gray-600 text-lg">誰と近くにいる時に一番ドキドキしたか</p>
            <div className="text-sm text-pink-500 mt-2 font-medium">{event.name}</div>
          </div>
        </div>

        {/* メイン結果 */}
        <ExcitementMainResult />

        {/* 詳細データ - スクロールで表示 */}
        <div className="space-y-6 mt-8">
          <ExcitementDetails />
          <ExcitementAnalysis />

          {/* 他の結果へのリンク */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100 relative overflow-hidden">
            {/* 背景のハート装飾 */}
            <div className="absolute top-3 right-3 text-pink-100 text-2xl opacity-25">💞</div>
            <div className="absolute bottom-3 left-3 text-rose-100 text-xl opacity-25">💝</div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6 relative z-10">
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                他の結果も見る 💕
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
              <Link
                href={`/results/${id}/heartrate-peak`}
                className="p-6 border-2 border-pink-200 rounded-xl hover:border-pink-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💓</div>
                  <div className="font-bold text-gray-900 mb-1">最大心拍数の時</div>
                  <div className="text-sm text-pink-600">誰が近くにいたか 💖</div>
                </div>
              </Link>
              
              <Link
                href={`/results/${id}/proximity`}
                className="p-6 border-2 border-rose-200 rounded-xl hover:border-rose-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">👫</div>
                  <div className="font-bold text-gray-900 mb-1">最も近くにいた人</div>
                  <div className="text-sm text-rose-600">平均距離が最も近い相手 💕</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}