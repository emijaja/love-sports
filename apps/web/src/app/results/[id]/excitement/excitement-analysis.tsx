'use client'

import { useState } from 'react'
import { TrendingUp } from 'lucide-react'

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

interface ExcitementAnalysisProps {
  participantData: ParticipantData
  profiles: Profile[]
}

export function ExcitementAnalysis({ participantData, profiles }: ExcitementAnalysisProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [showBalloonPop, setShowBalloonPop] = useState(false)
  const [showRanking, setShowRanking] = useState(false)
  const [currentRank, setCurrentRank] = useState(0)

  // ランキング上位3人の情報を取得
  const getParticipantName = (id: string) => {
    const profile = profiles.find(p => p.id === id)
    return profile?.nickname || '不明な相手'
  }

  const topRanking = participantData.excitementRanking.slice(0, 3).map((id, index) => ({
    id,
    name: getParticipantName(id),
    rank: index + 1,
    percentage: 92 - (index * 14) // サンプルデータとして92%, 78%, 64%
  }))

  const handleReveal = () => {
    setShowBalloonPop(true)
    // アニメーション後にランキング表示開始
    setTimeout(() => {
      setIsRevealed(true)
      setShowBalloonPop(false)
      setShowRanking(true)
    }, 1200)
  }

  const handleNextRank = () => {
    setCurrentRank(prev => prev + 1)
  }

  const handleStartRanking = () => {
    setCurrentRank(1)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100 relative overflow-hidden">
      {/* 背景のハート装飾 */}
      <div className="absolute top-2 right-2 text-pink-100 text-2xl opacity-20">💗</div>
      <div className="absolute bottom-2 left-2 text-rose-100 text-xl opacity-20">💘</div>
      
      {/* 宝箱が開くアニメーション */}
      {showBalloonPop && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
          {/* 宝箱が開く */}
          <div className="text-8xl animate-treasure-open">📦</div>
          
          {/* 魔法の光と宝石が飛び散る */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-treasure-glow-1">✨</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl animate-treasure-glow-2" style={{animationDelay: '0.1s'}}>🌟</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl animate-treasure-glow-3" style={{animationDelay: '0.2s'}}>💎</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-treasure-glow-4" style={{animationDelay: '0.3s'}}>✨</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl animate-treasure-glow-5" style={{animationDelay: '0.4s'}}>🌟</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-treasure-glow-6" style={{animationDelay: '0.5s'}}>💎</div>
          
          {/* ハートが舞い上がる */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl animate-treasure-hearts-1">💖</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-treasure-hearts-2" style={{animationDelay: '0.2s'}}>💕</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-treasure-hearts-3" style={{animationDelay: '0.4s'}}>💗</div>
        </div>
      )}
      
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center relative z-10">
        <TrendingUp className="h-6 w-6 mr-3 text-pink-500" />
        <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          ドキドキ度分析 💖
        </span>
      </h3>
      
      {!isRevealed ? (
        // 分析結果を隠した状態 - 宝箱ギミック
        <div className="space-y-6 relative z-10">
          {/* 宝箱エリア */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-dashed border-purple-300 text-center relative overflow-hidden">
            {/* 背景の装飾 */}
            <div className="absolute top-4 left-4 text-purple-200 text-2xl opacity-40 animate-bounce">💎</div>
            <div className="absolute top-6 right-6 text-pink-200 text-xl opacity-50 animate-pulse">✨</div>
            <div className="absolute bottom-4 left-8 text-purple-300 text-xl opacity-45 animate-bounce" style={{animationDelay: '1s'}}>🌟</div>
            <div className="absolute bottom-6 right-4 text-pink-300 text-2xl opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}>💖</div>
            
            <div className="relative z-10">
              {/* 宝箱アイコン */}
              <div className="text-8xl mb-6 animate-bounce">📦</div>
              
              {/* メッセージ */}
              <div className="space-y-4 mb-6">
                <div className="text-xl text-purple-600 font-bold mb-2">
                  🎁 ドキドキ度ランキングが宝箱に隠れています 🎁
                </div>
                <div className="text-sm text-gray-600 bg-white bg-opacity-60 rounded-lg p-3 border border-purple-200">
                  誰が一番あなたをドキドキさせたか、宝箱を開けて確認しましょう！<br/>
                  <span className="text-purple-600 font-medium">✨ きっと素敵な結果が待っています ✨</span>
                </div>
              </div>
              
              {/* 宝箱を開けるボタン */}
              <button
                onClick={handleReveal}
                className="group relative bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="text-2xl animate-pulse">🗝️</span>
                  <span className="text-lg">宝箱を開ける</span>
                  <span className="text-2xl animate-spin" style={{animationDuration: '2s'}}>✨</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* ヒントエリア */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-center">
              <div className="text-sm text-yellow-700 font-medium mb-1">💡 ヒント</div>
              <div className="text-xs text-yellow-600">
                心拍数が最も上がった相手が1位になるよ！💖
              </div>
            </div>
          </div>
          
          <div className="text-center text-xs text-purple-500 opacity-75">
            🎪 魔法の宝箱から素敵な結果が出てきます 🎪
          </div>
        </div>
      ) : !showRanking ? (
        // 宝箱が開いた後の結果発表準備画面
        <div className="space-y-6 relative z-10">
          <div className="text-center mb-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 border-2 border-purple-200 relative overflow-hidden">
            {/* 背景の魔法装飾 */}
            <div className="absolute top-2 left-2 text-purple-300 text-xl opacity-50 animate-pulse">✨</div>
            <div className="absolute top-4 right-4 text-pink-300 text-lg opacity-40 animate-bounce">🌟</div>
            <div className="absolute bottom-2 left-6 text-purple-400 text-lg opacity-45 animate-pulse" style={{animationDelay: '1s'}}>💎</div>
            <div className="absolute bottom-4 right-2 text-pink-400 text-xl opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}>✨</div>
            
            <div className="relative z-10">
              <div className="text-6xl mb-6 animate-bounce">🎊</div>
              <div className="text-3xl mb-4 font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ✨ 魔法のランキング発表 ✨
              </div>
              <div className="text-lg text-purple-600 mb-6">
                宝箱から素敵な結果が出てきました！
              </div>
              
              <button
                onClick={handleStartRanking}
                className="group relative bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="text-2xl animate-pulse">🏆</span>
                  <span className="text-lg">ランキング発表を開始</span>
                  <span className="text-2xl animate-spin" style={{animationDuration: '2s'}}>✨</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // 段階的なランキング発表
        <div className="space-y-6 relative z-10">
          {/* 魔法の結果発表エリア */}
          <div className="text-center mb-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 relative overflow-hidden">
            {/* 背景の魔法装飾 */}
            <div className="absolute top-2 left-2 text-purple-300 text-xl opacity-50 animate-pulse">✨</div>
            <div className="absolute top-4 right-4 text-pink-300 text-lg opacity-40 animate-bounce">🌟</div>
            <div className="absolute bottom-2 left-6 text-purple-400 text-lg opacity-45 animate-pulse" style={{animationDelay: '1s'}}>💎</div>
            <div className="absolute bottom-4 right-2 text-pink-400 text-xl opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}>✨</div>
            
            <div className="relative z-10">
              <div className="text-4xl mb-4 animate-bounce">🎉</div>
              <div className="text-3xl mb-3 font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🏆 魔法のドキドキ度ランキング 🏆
              </div>
              <div className="text-sm text-purple-600 bg-white bg-opacity-70 rounded-lg p-3 border border-purple-200">
                ✨ 宝箱から出てきた素敵な結果です ✨<br/>
                💕 各相手とのドキドキ度を比較しました 💕
              </div>
            </div>
          </div>
          
          {/* 1位 - クリックで表示 */}
          {currentRank >= 1 && (
            <div className="animate-fade-in bg-gradient-to-r from-yellow-50 to-pink-50 rounded-2xl p-6 border-2 border-yellow-300 shadow-xl relative overflow-hidden">
              {/* 魔法の光エフェクト */}
              <div className="absolute top-2 right-2 text-yellow-400 text-2xl opacity-60 animate-pulse">👑</div>
              <div className="absolute bottom-2 left-2 text-pink-300 text-xl opacity-50 animate-bounce">💖</div>
              <div className="absolute top-4 left-4 text-yellow-300 text-lg opacity-40 animate-spin" style={{animationDuration: '3s'}}>✨</div>
              <div className="absolute bottom-4 right-4 text-pink-400 text-lg opacity-45 animate-pulse" style={{animationDelay: '1s'}}>🌟</div>
              
              <div className="flex items-center space-x-4 mb-4 relative z-10">
                {/* 1位バッジ - 特別仕様 */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold text-2xl w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-300 animate-pulse">
                  🥇
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                      <span>💕</span>
                      <span>{topRanking[0]?.name}さん</span>
                      <span className="text-yellow-500 animate-bounce">✨</span>
                    </span>
                    <span className="text-2xl font-bold text-pink-600 animate-pulse">{topRanking[0]?.percentage}%</span>
                  </div>
                  <div className="w-full bg-pink-100 rounded-full h-5 shadow-inner border border-pink-200">
                    <div className="bg-gradient-to-r from-yellow-400 via-pink-400 to-pink-500 h-5 rounded-full shadow-sm animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center relative z-10">
                <div className="inline-block bg-gradient-to-r from-yellow-200 to-pink-200 text-yellow-800 px-6 py-3 rounded-full text-sm font-bold border-2 border-yellow-300 shadow-lg">
                  🥇 魔法のドキドキ度ナンバーワン！ 🥇
                </div>
              </div>
            </div>
          )}
          
          {/* 2位 - クリックで表示 */}
          {currentRank >= 2 && (
            <div className="animate-fade-in bg-gradient-to-r from-gray-50 to-pink-50 rounded-2xl p-6 border-2 border-gray-300 shadow-lg relative overflow-hidden">
              <div className="absolute top-2 right-2 text-gray-400 text-2xl opacity-60">🥈</div>
              <div className="absolute bottom-2 left-2 text-rose-300 text-xl opacity-50">💕</div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold text-gray-800">💖 {topRanking[1]?.name}さん</span>
                    <span className="text-2xl font-bold text-pink-500">{topRanking[1]?.percentage}%</span>
                  </div>
                  <div className="w-full bg-pink-100 rounded-full h-4 shadow-inner">
                    <div className="bg-gradient-to-r from-gray-400 to-pink-400 h-4 rounded-full shadow-sm" style={{ width: `${topRanking[1]?.percentage}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-bold">
                  🥈 ドキドキ度ナンバーツー！ 🥈
                </div>
              </div>
            </div>
          )}
          
          {/* 3位 - クリックで表示 */}
          {currentRank >= 3 && (
            <div className="animate-fade-in bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 border-2 border-orange-300 shadow-lg relative overflow-hidden">
              <div className="absolute top-2 right-2 text-orange-400 text-2xl opacity-60">🥉</div>
              <div className="absolute bottom-2 left-2 text-pink-300 text-xl opacity-50">💗</div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold text-gray-800">💗 {topRanking[2]?.name}さん</span>
                    <span className="text-2xl font-bold text-pink-400">{topRanking[2]?.percentage}%</span>
                  </div>
                  <div className="w-full bg-pink-100 rounded-full h-4 shadow-inner">
                    <div className="bg-gradient-to-r from-orange-400 to-pink-300 h-4 rounded-full shadow-sm" style={{ width: `${topRanking[2]?.percentage}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block bg-orange-200 text-orange-800 px-4 py-2 rounded-full text-sm font-bold">
                  🥉 ドキドキ度ナンバースリー！ 🥉
                </div>
              </div>
            </div>
          )}
          
          {/* 次の順位を表示するボタン */}
          {currentRank < 3 && (
            <div className="text-center mt-6">
              <button
                onClick={handleNextRank}
                className="group relative bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <span className="text-lg">👑</span>
                  <span>{currentRank === 0 ? '1位を発表' : currentRank === 1 ? '2位を発表' : '3位を発表'}</span>
                  <span className="text-lg animate-pulse">✨</span>
                </div>
              </button>
            </div>
          )}

          {/* 魔法の総合結果 - 全ランキング表示後にクリックで表示 */}
          {currentRank >= 3 && (
            <div className="text-center mt-8 animate-fade-in">
              <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 rounded-2xl p-8 border-2 border-purple-300 shadow-xl relative overflow-hidden">
                {/* 魔法の装飾 */}
                <div className="absolute top-4 left-4 text-purple-300 text-xl opacity-50 animate-pulse">✨</div>
                <div className="absolute top-6 right-6 text-pink-300 text-lg opacity-40 animate-bounce">🌟</div>
                <div className="absolute bottom-4 left-6 text-purple-400 text-lg opacity-45 animate-spin" style={{animationDuration: '4s'}}>💎</div>
                <div className="absolute bottom-6 right-4 text-pink-400 text-xl opacity-50 animate-pulse" style={{animationDelay: '1s'}}>✨</div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4 animate-bounce">🎊</div>
                  <div className="text-2xl mb-4 font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ✨ 魔法の総合結果 ✨
                  </div>
                  <div className="text-lg text-purple-700 font-bold mb-3">
                    💖 {topRanking[0]?.name}さんが一番あなたをドキドキさせました！ 💖
                  </div>
                  <div className="text-sm text-pink-600 bg-white bg-opacity-60 rounded-lg p-3 border border-pink-200">
                    🫀 心拍数が最も上昇した相手です<br/>
                    💕 宝箱から出てきた素敵な結果でした 💕
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
