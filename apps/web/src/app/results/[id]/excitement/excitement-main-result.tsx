'use client'

import { useState, useEffect } from 'react'
import { Heart, Sparkles } from 'lucide-react'

export function ExcitementMainResult() {
  const [isRevealed, setIsRevealed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showHeartBurst, setShowHeartBurst] = useState(false)
  const [showFullScreen, setShowFullScreen] = useState(false)
  const [showHeartExplosion, setShowHeartExplosion] = useState(false)

  const handleReveal = () => {
    setIsRevealed(true)
    setShowFullScreen(true)
    setShowHeartBurst(true)
    setShowHeartExplosion(true)
    setShowConfetti(true)
    
    // 2秒後にハートバーストを消す
    setTimeout(() => setShowHeartBurst(false), 2000)
    // 3秒後にハートエクスプロージョンを消す
    setTimeout(() => setShowHeartExplosion(false), 3000)
    // 5秒後にコンフェッティを消す
    setTimeout(() => setShowConfetti(false), 5000)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (showFullScreen) {
        const scrollPosition = window.scrollY
        if (scrollPosition > 50) {
          setShowFullScreen(false)
        }
      }
    }

    if (showFullScreen) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [showFullScreen])

  return (
    <div className={`${!isRevealed ? 'fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex items-center justify-center z-20' : showFullScreen ? 'fixed inset-0 z-30' : 'relative bg-transparent'}`}>
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

      {/* ハートバーストエフェクト */}
      {showHeartBurst && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* 中心から放射状にハートがはじける */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 text-8xl animate-heart-burst">💖</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-500 text-6xl animate-heart-burst-2" style={{animationDelay: '0.1s'}}>💕</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-400 text-7xl animate-heart-burst-3" style={{animationDelay: '0.2s'}}>💗</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-5xl animate-heart-burst-4" style={{animationDelay: '0.3s'}}>💓</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-600 text-6xl animate-heart-burst-5" style={{animationDelay: '0.4s'}}>💘</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-400 text-5xl animate-heart-burst-6" style={{animationDelay: '0.5s'}}>💝</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 text-7xl animate-heart-burst-7" style={{animationDelay: '0.6s'}}>💞</div>
        </div>
      )}

      {/* ハートエクスプロージョンエフェクト */}
      {showHeartExplosion && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {/* 中心から大量のハートが飛び散る */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 text-3xl animate-heart-explode-1">💖</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-500 text-2xl animate-heart-explode-2" style={{animationDelay: '0.05s'}}>💕</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-400 text-3xl animate-heart-explode-3" style={{animationDelay: '0.1s'}}>💗</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-2xl animate-heart-explode-4" style={{animationDelay: '0.15s'}}>💓</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-600 text-3xl animate-heart-explode-5" style={{animationDelay: '0.2s'}}>💘</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-400 text-2xl animate-heart-explode-6" style={{animationDelay: '0.25s'}}>💝</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 text-3xl animate-heart-explode-7" style={{animationDelay: '0.3s'}}>💞</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-300 text-2xl animate-heart-explode-8" style={{animationDelay: '0.35s'}}>💖</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-300 text-3xl animate-heart-explode-9" style={{animationDelay: '0.4s'}}>💕</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-400 text-2xl animate-heart-explode-10" style={{animationDelay: '0.45s'}}>💗</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 text-3xl animate-heart-explode-11" style={{animationDelay: '0.5s'}}>💓</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-500 text-2xl animate-heart-explode-12" style={{animationDelay: '0.55s'}}>💘</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-400 text-3xl animate-heart-explode-13" style={{animationDelay: '0.6s'}}>💝</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-300 text-2xl animate-heart-explode-14" style={{animationDelay: '0.65s'}}>💞</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-600 text-3xl animate-heart-explode-15" style={{animationDelay: '0.7s'}}>💖</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-400 text-2xl animate-heart-explode-16" style={{animationDelay: '0.75s'}}>💕</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-300 text-3xl animate-heart-explode-17" style={{animationDelay: '0.8s'}}>💗</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-2xl animate-heart-explode-18" style={{animationDelay: '0.85s'}}>💓</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 text-3xl animate-heart-explode-19" style={{animationDelay: '0.9s'}}>💘</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-300 text-2xl animate-heart-explode-20" style={{animationDelay: '0.95s'}}>💝</div>
        </div>
      )}

      {/* コンフェッティエフェクト */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 text-pink-400 text-4xl animate-bounce opacity-80">💖</div>
          <div className="absolute top-1/3 right-1/3 text-rose-400 text-3xl animate-bounce opacity-80" style={{animationDelay: '0.2s'}}>💕</div>
          <div className="absolute bottom-1/3 left-1/3 text-pink-300 text-3xl animate-bounce opacity-80" style={{animationDelay: '0.4s'}}>💗</div>
          <div className="absolute bottom-1/4 right-1/4 text-rose-300 text-4xl animate-bounce opacity-80" style={{animationDelay: '0.6s'}}>💓</div>
          <div className="absolute top-1/2 left-1/2 text-pink-500 text-3xl animate-bounce opacity-80" style={{animationDelay: '0.8s'}}>💘</div>
          <div className="absolute top-1/6 right-1/6 text-rose-500 text-2xl animate-bounce opacity-80" style={{animationDelay: '1s'}}>💝</div>
          <div className="absolute bottom-1/6 left-1/6 text-pink-400 text-2xl animate-bounce opacity-80" style={{animationDelay: '1.2s'}}>💞</div>
        </div>
      )}

      <div className={`text-center px-8 ${!isRevealed ? 'max-w-4xl mx-auto' : 'max-w-2xl mx-auto'}`}>
        {!isRevealed ? (
          // 結果を隠した状態
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="text-8xl mb-6 animate-pulse">❓</div>
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-8 border-4 border-dashed border-pink-300 max-w-2xl mx-auto">
                <div className="text-2xl text-pink-600 font-bold mb-4">💕 結果は秘密です 💕</div>
                <div className="text-lg text-gray-600 mb-6">クリックしてあなたのドキドキ相手を確認しましょう！</div>
              </div>
              
              <button
                onClick={handleReveal}
                className="group relative bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-6 px-12 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 overflow-hidden text-xl"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <Heart className="h-8 w-8 fill-current animate-pulse" />
                  <span>結果を見る</span>
                  <Sparkles className="h-6 w-6 animate-spin" />
                </div>
              </button>
              
              <div className="text-lg text-pink-500 opacity-75">
                💖 心の準備はできていますか？ 💖
              </div>
            </div>
          </div>
        ) : showFullScreen ? (
          // 結果を表示した状態 - 画面全体に表示
          <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex items-center justify-center h-full relative overflow-hidden">
            {/* 背景のハートの海 - より動きのあるアニメーション */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-8 text-pink-200 text-3xl opacity-40 animate-heart-float-1">💖</div>
              <div className="absolute top-12 right-12 text-rose-200 text-2xl opacity-50 animate-heart-float-2">💕</div>
              <div className="absolute top-20 left-1/4 text-pink-300 text-2xl opacity-40 animate-heart-float-3">💗</div>
              <div className="absolute top-32 right-1/4 text-red-200 text-3xl opacity-45 animate-heart-float-4">💓</div>
              <div className="absolute top-40 left-16 text-pink-400 text-2xl opacity-50 animate-heart-float-5">💘</div>
              <div className="absolute top-48 right-16 text-rose-300 text-2xl opacity-40 animate-heart-float-6">💝</div>
              <div className="absolute top-56 left-1/3 text-pink-200 text-3xl opacity-45 animate-heart-float-7">💞</div>
              
              <div className="absolute bottom-16 left-8 text-pink-300 text-2xl opacity-40 animate-heart-float-8">💖</div>
              <div className="absolute bottom-24 right-12 text-rose-200 text-3xl opacity-50 animate-heart-float-9">💕</div>
              <div className="absolute bottom-32 left-1/4 text-pink-400 text-2xl opacity-40 animate-heart-float-10">💗</div>
              <div className="absolute bottom-40 right-1/4 text-red-300 text-2xl opacity-45 animate-heart-float-11">💓</div>
              <div className="absolute bottom-48 left-16 text-pink-200 text-3xl opacity-50 animate-heart-float-12">💘</div>
              <div className="absolute bottom-56 right-16 text-rose-400 text-2xl opacity-40 animate-heart-float-13">💝</div>
              
              <div className="absolute top-1/2 left-4 text-pink-300 text-2xl opacity-40 animate-heart-float-14">💞</div>
              <div className="absolute top-1/2 right-4 text-rose-200 text-3xl opacity-50 animate-heart-float-15">💖</div>
              
              {/* 追加のハート - より多くの動き */}
              <div className="absolute top-1/4 left-1/2 text-pink-400 text-xl opacity-30 animate-heart-dance-1">💕</div>
              <div className="absolute top-3/4 right-1/3 text-rose-300 text-xl opacity-35 animate-heart-dance-2">💗</div>
              <div className="absolute bottom-1/4 left-1/3 text-pink-300 text-xl opacity-40 animate-heart-dance-3">💓</div>
              <div className="absolute top-1/3 right-1/4 text-red-200 text-xl opacity-30 animate-heart-dance-4">💘</div>
              <div className="absolute bottom-1/3 left-1/5 text-rose-400 text-xl opacity-35 animate-heart-dance-5">💝</div>
              <div className="absolute top-2/3 right-1/5 text-pink-200 text-xl opacity-40 animate-heart-dance-6">💞</div>
            </div>
            
            <div className="text-center space-y-8 relative z-10">
              {/* メインハート群 - より動きのあるアニメーション */}
              <div className="flex justify-center items-center space-x-4 mb-8">
                <div className="text-8xl animate-heart-spin-1">💕</div>
                <div className="text-9xl animate-heart-spin-2">💖</div>
                <div className="text-8xl animate-heart-spin-3">💗</div>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-center items-center space-x-2 mb-6">
                  <div className="text-6xl animate-heart-wiggle-1">💕</div>
                  <h2 className="text-7xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent animate-text-glow">
                    田中 太郎さん
                  </h2>
                  <div className="text-6xl animate-heart-wiggle-2">💖</div>
                </div>
                
                <div className="flex justify-center items-center space-x-4 mb-8">
                  <div className="text-4xl animate-heart-wiggle-3">💗</div>
                  <p className="text-3xl text-gray-700 animate-text-shimmer">あなたが最もドキドキした相手です</p>
                  <div className="text-4xl animate-heart-wiggle-4">💕</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl text-pink-600 bg-pink-50 rounded-2xl p-6 border-2 border-pink-200 inline-block animate-pulse">
                    💖 下にスクロールして詳細データを確認してください 💖
                  </div>
                </div>
              </div>
              
              {/* 下部のハート装飾 - より動きのあるアニメーション */}
              <div className="flex justify-center items-center space-x-6 mt-8">
                <div className="text-5xl animate-heart-orbit-1">💓</div>
                <div className="text-4xl animate-heart-orbit-2">💘</div>
                <div className="text-5xl animate-heart-orbit-3">💝</div>
                <div className="text-4xl animate-heart-orbit-4">💞</div>
                <div className="text-5xl animate-heart-orbit-5">💕</div>
              </div>
            </div>
          </div>
        ) : (
          // 通常表示状態
          <div className="space-y-6 relative">
            {/* 背景のハート装飾 */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 left-4 text-pink-200 text-2xl opacity-50 animate-bounce">💖</div>
              <div className="absolute top-4 right-4 text-rose-200 text-xl opacity-40 animate-pulse">💕</div>
              <div className="absolute bottom-2 left-8 text-pink-300 text-xl opacity-45 animate-bounce" style={{animationDelay: '1s'}}>💗</div>
              <div className="absolute bottom-4 right-8 text-red-200 text-2xl opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}>💓</div>
            </div>
            
            <div className="flex justify-center items-center space-x-3 mb-4 relative z-10">
              <div className="text-5xl animate-bounce">💕</div>
              <div className="text-6xl animate-bounce" style={{animationDelay: '0.2s'}}>💖</div>
              <div className="text-5xl animate-bounce" style={{animationDelay: '0.4s'}}>💗</div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-pink-200 relative z-10">
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="text-3xl animate-pulse">💕</div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  田中 太郎さん
                </h2>
                <div className="text-3xl animate-pulse" style={{animationDelay: '0.3s'}}>💖</div>
              </div>
              
              <div className="flex justify-center items-center space-x-3 mb-6">
                <div className="text-2xl animate-bounce">💗</div>
                <p className="text-xl text-gray-600">あなたが最もドキドキした相手です</p>
                <div className="text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>💕</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg text-pink-600 bg-pink-50 rounded-xl p-4 border border-pink-200 inline-block animate-pulse">
                  💖 下にスクロールして詳細データを確認してください 💖
                </div>
              </div>
            </div>
            
            {/* 下部のハート装飾 */}
            <div className="flex justify-center items-center space-x-4 mt-4 relative z-10">
              <div className="text-3xl animate-bounce" style={{animationDelay: '0.1s'}}>💓</div>
              <div className="text-2xl animate-bounce" style={{animationDelay: '0.3s'}}>💘</div>
              <div className="text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>💝</div>
              <div className="text-2xl animate-bounce" style={{animationDelay: '0.7s'}}>💞</div>
              <div className="text-3xl animate-bounce" style={{animationDelay: '0.9s'}}>💕</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
