'use client'

import { Calendar, Clock, Trophy, BarChart, Loader } from 'lucide-react'
import Link from 'next/link'

interface Event {
  id: string
  name: string
  status: string
  starts_at_ms: number
  ends_at_ms: number
}

interface EventStatusContentProps {
  event: Event
}

export default function EventStatusContent({ event }: EventStatusContentProps) {
  const renderContent = () => {
    switch (event.status) {
      case 'preparing':
        return (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              イベントは準備中です
            </h3>
            <p className="text-gray-600 mb-4">
              まもなく開始予定です。お待ちください。
            </p>
            <div className="text-sm text-gray-500">
              開始予定: {new Date(event.starts_at_ms).toLocaleString('ja-JP')}
            </div>
          </div>
        )

      case 'active':
        return (
          <div className="text-center py-8">
            <div className="relative">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              イベント中です
            </h3>
            <p className="text-gray-600 mb-4">
              現在イベントが進行中です。楽しんでください！
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                💓 心拍数と距離データを計測中...
              </p>
            </div>
          </div>
        )

      case 'intervel':
        return (
          <div className="py-6">
            <div className="text-center mb-6">
              <BarChart className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                インターバル中
              </h3>
              <p className="text-gray-600">
                休憩時間です。途中結果をご確認ください。
              </p>
            </div>
            <InterimResults eventId={event.id} />
          </div>
        )

      case 'ended':
        return (
          <div className="py-6">
            <div className="text-center mb-6">
              <Loader className="h-12 w-12 text-gray-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                最終結果を集計中です
              </h3>
              <p className="text-gray-600 mb-4">
                イベントは終了しました。最終結果の準備をしています。
              </p>
            </div>
            <InterimResults eventId={event.id} showFinalProcessing />
          </div>
        )

      case 'published':
        return (
          <div className="py-6">
            <div className="text-center mb-6">
              <Trophy className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                最終結果発表
              </h3>
              <p className="text-gray-600">
                お疲れ様でした！最終結果をご確認ください。
              </p>
            </div>
            <FinalResults eventId={event.id} />
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {event.name}
            </h3>
            <p className="text-gray-600">
              ステータス: {event.status}
            </p>
          </div>
        )
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-gray-900">{event.name}</h2>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            event.status === 'preparing'
              ? 'bg-yellow-100 text-yellow-800'
              : event.status === 'active'
              ? 'bg-green-100 text-green-800'
              : event.status === 'intervel'
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
            : event.status === 'intervel'
            ? 'インターバル'
            : event.status === 'ended'
            ? '終了'
            : '結果公開中'}
        </span>
      </div>
      {renderContent()}
    </div>
  )
}

// 途中結果表示コンポーネント
function InterimResults({ eventId, showFinalProcessing = false }: { 
  eventId: string
  showFinalProcessing?: boolean 
}) {
  return (
    <div className="space-y-4">
      {showFinalProcessing && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <Loader className="h-4 w-4 text-yellow-600 animate-spin mr-2" />
            <p className="text-sm text-yellow-800">
              最終結果を集計中です...
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          <h4 className="font-medium text-pink-900 mb-2">💕 ドキドキ相手</h4>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-2">💓 最大心拍数の時</h4>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">👫 最も近くにいた人</h4>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        {showFinalProcessing ? '最終結果の準備ができ次第、詳細な結果をお届けします' : 'イベント後に詳細な結果をお届けします'}
      </div>
    </div>
  )
}

// 最終結果表示コンポーネント
function FinalResults({ eventId }: { eventId: string }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href={`/results/${eventId}/excitement`}
          className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-6 hover:from-pink-100 hover:to-pink-200 transition-colors"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">💕</div>
            <h4 className="font-medium text-pink-900 mb-3">ドキドキ相手</h4>
            <p className="text-sm text-pink-700">誰と近くにいる時に一番ドキドキしたか</p>
          </div>
        </Link>
        
        <Link
          href={`/results/${eventId}/heartrate-peak`}
          className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6 hover:from-red-100 hover:to-red-200 transition-colors"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">💓</div>
            <h4 className="font-medium text-red-900 mb-3">最大心拍数の時</h4>
            <p className="text-sm text-red-700">最大心拍数のとき、誰が近くにいたか</p>
          </div>
        </Link>
        
        <Link
          href={`/results/${eventId}/proximity`}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:from-blue-100 hover:to-blue-200 transition-colors"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">👫</div>
            <h4 className="font-medium text-blue-900 mb-3">最も近くにいた人</h4>
            <p className="text-sm text-blue-700">もっとも近くにいた人</p>
          </div>
        </Link>
      </div>
      
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-2">🎉 マッチング完了！</h3>
        <p className="text-pink-100">
          スポーツを通じて素敵な出会いが見つかりました
        </p>
      </div>
    </div>
  )
}