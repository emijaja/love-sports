'use client'

import { useState } from 'react'
import { Heart, Sparkles } from 'lucide-react'

interface Profile {
  id: string
  nickname: string
}

interface ParticipantData {
  excitementRanking: string[]
  excitementDetails?: {
    [participantId: string]: {
      excitementLevel: string
      duration: number
      peakTime: string
    }
  }
  heartRateDetails?: {
    maxHeartRate: number
    minDistance: number
    peakTime: string
  }
}

interface ExcitementResultProps {
  participantData: ParticipantData
  profiles: Profile[]
}

export function ExcitementResult({ participantData, profiles }: ExcitementResultProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // 最もドキドキした相手の情報を取得
  const topExcitementParticipantId = participantData.excitementRanking[0]
  const topExcitementProfile = profiles.find(p => p.id === topExcitementParticipantId)
  const topExcitementName = topExcitementProfile?.nickname || '不明な相手'

  // 心拍数と距離の情報を取得
  const maxHeartRate = participantData.heartRateDetails?.maxHeartRate || 165
  const minDistance = participantData.heartRateDetails?.minDistance || 2.1
  const peakTime = participantData.heartRateDetails?.peakTime || '15:23'

  const handleReveal = () => {
    setIsRevealed(true)
    setShowConfetti(true)
    
    // 3秒後にコンフェッティを消す
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-pink-100 relative overflow-hidden">
      {/* 背景のハート装飾 */}
      <div className="absolute top-4 right-4 text-pink-100 text-4xl opacity-30">💖</div>
      <div className="absolute bottom-4 left-4 text-rose-100 text-3xl opacity-30">💕</div>
      
      {/* コンフェッティエフェクト */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 text-pink-400 text-2xl animate-bounce opacity-80">💖</div>
          <div className="absolute top-1/3 right-1/3 text-rose-400 text-xl animate-bounce opacity-80" style={{animationDelay: '0.2s'}}>💕</div>
          <div className="absolute bottom-1/3 left-1/3 text-pink-300 text-xl animate-bounce opacity-80" style={{animationDelay: '0.4s'}}>💗</div>
          <div className="absolute bottom-1/4 right-1/4 text-rose-300 text-2xl animate-bounce opacity-80" style={{animationDelay: '0.6s'}}>💓</div>
          <div className="absolute top-1/2 left-1/2 text-pink-500 text-xl animate-bounce opacity-80" style={{animationDelay: '0.8s'}}>💘</div>
        </div>
      )}

      <div className="text-center mb-6 relative z-10">
        {!isRevealed ? (
          // 結果を隠した状態
          <div className="space-y-6">
            <div className="text-7xl mb-4 animate-pulse">❓</div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg p-4 border-2 border-dashed border-pink-300">
                <div className="text-lg text-pink-600 font-medium mb-2">💕 結果は秘密です 💕</div>
                <div className="text-sm text-gray-600">クリックしてあなたのドキドキ相手を確認しましょう！</div>
              </div>
              
              <button
                onClick={handleReveal}
                className="group relative bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <Heart className="h-6 w-6 fill-current animate-pulse" />
                  <span className="text-lg">結果を見る</span>
                  <Sparkles className="h-5 w-5 animate-spin" />
                </div>
              </button>
              
              <div className="text-xs text-pink-500 opacity-75">
                💖 心の準備はできていますか？ 💖
              </div>
            </div>
          </div>
        ) : (
          // 結果を表示した状態
          <div className="space-y-6">
            <div className="text-7xl mb-4 animate-bounce">💕</div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
                {topExcitementName}さん 💖
              </h2>
              <p className="text-gray-600 text-lg">あなたが最もドキドキした相手です ✨</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 text-center border border-pink-200 shadow-sm animate-fade-in">
                <div className="text-3xl font-bold text-pink-600 mb-1">{maxHeartRate} bpm</div>
                <div className="text-sm text-pink-700 font-medium">💓 最高心拍数</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-6 text-center border border-red-200 shadow-sm animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="text-3xl font-bold text-red-600 mb-1">{minDistance}m</div>
                <div className="text-sm text-red-700 font-medium">💕 その時の距離</div>
              </div>
            </div>

            <div className="text-center text-sm text-pink-600 bg-pink-50 rounded-lg p-3 border border-pink-200 animate-fade-in" style={{animationDelay: '0.4s'}}>
              💖 {peakTime}頃に最も心拍数が上昇しました 💖
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
