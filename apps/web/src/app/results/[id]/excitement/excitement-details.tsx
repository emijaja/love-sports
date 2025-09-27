'use client'

import { useState, useEffect } from 'react'

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
}

interface ExcitementDetailsProps {
  participantData: ParticipantData
  profiles: Profile[]
}

export function ExcitementDetails({ participantData, profiles }: ExcitementDetailsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      
      // スクロールが少し進んだら表示（より早めに表示）
      if (scrollPosition > windowHeight * 0.3) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 最もドキドキした相手の情報を取得
  const topExcitementParticipantId = participantData.excitementRanking[0]
  const topExcitementProfile = profiles.find(p => p.id === topExcitementParticipantId)
  const topExcitementName = topExcitementProfile?.nickname || '不明な相手'
  const topExcitementDetails = participantData.excitementDetails?.[topExcitementParticipantId]

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="bg-white rounded-xl shadow-xl p-8 border border-pink-100 relative overflow-hidden mb-8">
        {/* 背景のハート装飾 */}
        <div className="absolute top-4 right-4 text-pink-100 text-4xl opacity-30">💖</div>
        <div className="absolute bottom-4 left-4 text-rose-100 text-3xl opacity-30">💕</div>
        
        <div className="text-center mb-6 relative z-10">
          <div className="text-6xl mb-4 animate-pulse">📊</div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
            詳細データ 💕
          </h3>
          <p className="text-gray-600 text-lg">{topExcitementName}さんとのドキドキデータ詳細</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-8 text-center border border-pink-200 shadow-lg">
            <div className="text-4xl font-bold text-pink-600 mb-2">165 bpm</div>
            <div className="text-lg text-pink-700 font-medium mb-2">💓 最高心拍数</div>
            <div className="text-sm text-gray-600">通常時: 72 bpm</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-8 text-center border border-red-200 shadow-lg">
            <div className="text-4xl font-bold text-red-600 mb-2">2.1m</div>
            <div className="text-lg text-red-700 font-medium mb-2">💕 その時の距離</div>
            <div className="text-sm text-gray-600">平均距離: 5.2m</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center border border-purple-200 shadow-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">{topExcitementDetails?.peakTime || '不明'}</div>
            <div className="text-sm text-purple-700 font-medium">💜 ピーク時刻</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6 text-center border border-orange-200 shadow-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">{topExcitementDetails?.duration ? `${topExcitementDetails.duration}秒` : '不明'}</div>
            <div className="text-sm text-orange-700 font-medium">🧡 持続時間</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-pink-50 rounded-xl p-6 text-center border border-green-200 shadow-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">{topExcitementDetails?.excitementLevel || '不明'}</div>
            <div className="text-sm text-green-700 font-medium">💚 興奮レベル</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg text-pink-600 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
            💖 {topExcitementDetails?.peakTime || '不明な時間'}頃に最も心拍数が上昇しました 💖
          </div>
        </div>
      </div>
    </div>
  )
}
