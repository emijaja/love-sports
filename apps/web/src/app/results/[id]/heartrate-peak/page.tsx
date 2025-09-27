import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Activity, Clock, Heart, Trophy, Star, Sparkles, Target, Flame, Award, Crown } from 'lucide-react'

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

  // 結果データの取得
  const { data: resultData } = await supabase
    .from('results_final')
    .select('per_participant_json')
    .eq('event_id', id)
    .single()

  if (!resultData) {
    notFound()
  }

  const participantData = resultData.per_participant_json[session.user.id]
  if (!participantData) {
    notFound()
  }

  // 関連する参加者のプロフィールを取得
  const relatedParticipantIds = [
    ...participantData.heartRateRanking,
    ...(participantData.heartRateDetails?.peakNearestParticipant ? [participantData.heartRateDetails.peakNearestParticipant] : [])
  ].filter((id, index, self) => self.indexOf(id) === index) // 重複除去

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, nickname')
    .in('id', relatedParticipantIds)

  // 最大心拍数時に最も近くにいた人の情報を取得
  const peakNearestParticipantId = participantData.heartRateDetails?.peakNearestParticipant
  const peakNearestProfile = profiles?.find(p => p.id === peakNearestParticipantId)
  const peakNearestName = peakNearestProfile?.nickname || '不明な相手'
  
  // 心拍数データ
  const heartRateData = participantData.heartRateDetails || {}
  const peakHeartRate = heartRateData.peakHeartRate || 180
  const peakTime = heartRateData.peakTime || '15:47'
  const peakDistance = heartRateData.peakDistance || 1.5
  const heartRateTimeline = heartRateData.heartRateTimeline || [
    {"time": "15:45", "bpm": 153},
    {"time": "15:46", "bpm": 165},
    {"time": "15:47", "bpm": 180},
    {"time": "15:48", "bpm": 158}
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* ハート爆発アニメーション */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* 中心から外側に向かって飛び散るハート */}
          <div className="absolute animate-heart-explosion-1">
            <div className="text-9xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-2">
            <div className="text-8xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-3">
            <div className="text-9xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-4">
            <div className="text-8xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-5">
            <div className="text-9xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-6">
            <div className="text-8xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-7">
            <div className="text-9xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-8">
            <div className="text-8xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-9">
            <div className="text-9xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-10">
            <div className="text-8xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-11">
            <div className="text-9xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-12">
            <div className="text-8xl">💘</div>
          </div>
          
          {/* 追加のハート群 - 第2波 */}
          <div className="absolute animate-heart-explosion-13">
            <div className="text-7xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-14">
            <div className="text-6xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-15">
            <div className="text-7xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-16">
            <div className="text-6xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-17">
            <div className="text-7xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-18">
            <div className="text-6xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-19">
            <div className="text-7xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-20">
            <div className="text-6xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-21">
            <div className="text-7xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-22">
            <div className="text-6xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-23">
            <div className="text-7xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-24">
            <div className="text-6xl">💘</div>
          </div>
          
          {/* 追加のハート群 - 第3波 */}
          <div className="absolute animate-heart-explosion-25">
            <div className="text-5xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-26">
            <div className="text-4xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-27">
            <div className="text-5xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-28">
            <div className="text-4xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-29">
            <div className="text-5xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-30">
            <div className="text-4xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-31">
            <div className="text-5xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-32">
            <div className="text-4xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-33">
            <div className="text-5xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-34">
            <div className="text-4xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-35">
            <div className="text-5xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-36">
            <div className="text-4xl">💘</div>
          </div>
          
          {/* 追加のハート群 - 第4波 */}
          <div className="absolute animate-heart-explosion-37">
            <div className="text-3xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-38">
            <div className="text-2xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-39">
            <div className="text-3xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-40">
            <div className="text-2xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-41">
            <div className="text-3xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-42">
            <div className="text-2xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-43">
            <div className="text-3xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-44">
            <div className="text-2xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-45">
            <div className="text-3xl">💘</div>
          </div>
          <div className="absolute animate-heart-explosion-46">
            <div className="text-2xl">💕</div>
          </div>
          <div className="absolute animate-heart-explosion-47">
            <div className="text-3xl">💖</div>
          </div>
          <div className="absolute animate-heart-explosion-48">
            <div className="text-2xl">💘</div>
          </div>
        </div>
      </div>

      {/* 背景の装飾要素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* 浮遊するハートとキューピッド */}
        <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
          <Heart className="w-6 h-6 text-red-400 opacity-70" />
        </div>
        <div className="absolute top-32 right-16 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '4s' }}>
          <Star className="w-5 h-5 text-yellow-400 opacity-70" />
        </div>
        <div className="absolute bottom-32 left-16 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>
          <Sparkles className="w-6 h-6 text-pink-400 opacity-70" />
        </div>
        <div className="absolute bottom-20 right-20 animate-bounce" style={{ animationDelay: '3s', animationDuration: '3.5s' }}>
          <Trophy className="w-5 h-5 text-orange-400 opacity-70" />
        </div>
        
        {/* 追加のハート */}
        <div className="absolute top-40 left-1/4 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}>
          <Heart className="w-4 h-4 text-pink-400 opacity-60" />
        </div>
        <div className="absolute top-60 right-1/4 animate-bounce" style={{ animationDelay: '3.5s', animationDuration: '3s' }}>
          <Heart className="w-5 h-5 text-red-300 opacity-60" />
        </div>
        <div className="absolute bottom-40 left-1/3 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}>
          <Heart className="w-3 h-3 text-pink-300 opacity-60" />
        </div>
        <div className="absolute bottom-60 right-1/3 animate-bounce" style={{ animationDelay: '4.5s', animationDuration: '2s' }}>
          <Heart className="w-4 h-4 text-red-200 opacity-60" />
        </div>
        
        {/* キューピッド */}
        <div className="absolute top-16 left-1/2 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
          <div className="text-2xl">💘</div>
        </div>
        <div className="absolute top-1/3 right-8 animate-bounce" style={{ animationDelay: '4s', animationDuration: '3.5s' }}>
          <div className="text-xl">💕</div>
        </div>
        <div className="absolute bottom-1/3 left-8 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <div className="text-lg">💖</div>
        </div>
        
        {/* 恋の矢 */}
        <div className="absolute top-24 right-1/3 animate-pulse" style={{ animationDelay: '3s', animationDuration: '2s' }}>
          <div className="text-lg transform rotate-45">💘</div>
        </div>
        <div className="absolute bottom-24 left-1/4 animate-pulse" style={{ animationDelay: '5s', animationDuration: '2.5s' }}>
          <div className="text-sm transform -rotate-45">💘</div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 group transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            ダッシュボードに戻る
          </Link>
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-2xl">
                <Activity className="h-12 w-12 text-red-600 animate-pulse" />
                <Flame className="h-6 w-6 text-orange-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
              💘 恋に落ちる瞬間 💘
            </h1>
            <p className="text-xl text-gray-700 mb-2 font-semibold">最大心拍数のとき、誰が近くにいたか</p>
            <div className="text-lg text-pink-600 font-bold mb-4 animate-pulse">
              💕 キューピッドの矢が刺さった瞬間！ 💕
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
              <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">{event.name}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* メイン結果 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 group-hover:-translate-y-2">
              <div className="text-center mb-8">
                <div className="relative inline-block mb-6">
                  <div className="text-8xl mb-4 animate-bounce">💓</div>
                  <div className="absolute -top-2 -right-2">
                    <Crown className="w-8 h-8 text-yellow-500 animate-pulse" />
                  </div>
                  <div className="absolute -top-4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>
                    💘
                  </div>
                  <div className="absolute -bottom-2 -right-4 text-xl animate-bounce" style={{ animationDelay: '2s' }}>
                    💕
                  </div>
                </div>
                <h2 className="text-3xl font-black text-red-600 mb-3 group-hover:scale-105 transition-transform duration-300">
                  💖 {peakNearestName}さん 💖
                </h2>
                <p className="text-lg text-gray-600 font-medium">最大心拍数を記録した時に最も近くにいた人</p>
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-full">
                  <Award className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 font-semibold">💘 恋のチャンピオン 💘</span>
                </div>
                <div className="mt-3 text-sm text-pink-600 font-bold animate-pulse">
                  ✨ キューピッドの矢が命中！ ✨
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="group/card relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-red-600 rounded-xl blur opacity-75 group-hover/card:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center group-hover/card:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    <div className="text-3xl font-black text-red-600 mb-2">{peakHeartRate} bpm</div>
                    <div className="text-sm text-red-700 font-semibold">最大心拍数</div>
                    <div className="mt-2 text-xs text-red-600">💘 恋のドキドキ！</div>
                  </div>
                </div>

                <div className="group/card relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl blur opacity-75 group-hover/card:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center group-hover/card:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    <div className="text-3xl font-black text-orange-600 mb-2">{peakDistance}m</div>
                    <div className="text-sm text-orange-700 font-semibold">その時の距離</div>
                    <div className="mt-2 text-xs text-orange-600">💕 恋の距離！</div>
                  </div>
                </div>

                <div className="group/card relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl blur opacity-75 group-hover/card:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center group-hover/card:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    <div className="text-3xl font-black text-yellow-600 mb-2">{peakTime}</div>
                    <div className="text-sm text-yellow-700 font-semibold">記録時刻</div>
                    <div className="mt-2 text-xs text-yellow-600">💘 恋の瞬間！</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-100 via-pink-100 to-orange-100 rounded-2xl p-6 border-2 border-red-200">
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl animate-bounce">💘</div>
                    <span className="text-red-800 font-bold text-lg">
                      この瞬間が恋に落ちた時間でした！
                    </span>
                    <div className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>💕</div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <div className="inline-flex items-center px-4 py-2 bg-white/80 rounded-full">
                    <Heart className="w-4 h-4 text-pink-500 mr-2 animate-pulse" />
                    <span className="text-sm font-semibold text-gray-700">💖 キューピッドの矢が命中！</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <div className="text-xs text-pink-600 font-bold animate-pulse">
                    ✨ 恋の魔法が起こった瞬間 ✨
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 心拍数推移 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                <Heart className="h-6 w-6 mr-3 text-pink-600 animate-pulse" />
                恋のドキドキ推移（ピーク付近）
                <div className="text-lg ml-3 animate-bounce">💘</div>
              </h3>
              
              <div className="space-y-4">
                {heartRateTimeline.map((dataPoint, index) => {
                  const isPeak = dataPoint.bpm === peakHeartRate
                  const widthPercentage = Math.round((dataPoint.bpm / peakHeartRate) * 100)
                  
                  return (
                    <div key={index} className={`group/item flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                      isPeak 
                        ? 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 hover:from-red-100 hover:to-pink-100 shadow-lg'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isPeak 
                            ? 'bg-red-200 animate-pulse'
                            : index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-orange-100' : 'bg-orange-100'
                        }`}>
                          {isPeak ? (
                            <Crown className="w-4 h-4 text-red-600" />
                          ) : (
                            <span className={`text-sm font-bold ${
                              index === 0 ? 'text-yellow-600' : 'text-orange-600'
                            }`}>{index + 1}</span>
                          )}
                        </div>
                        <span className={`text-sm font-semibold ${
                          isPeak ? 'text-red-600 font-bold' : 'text-gray-700'
                        }`}>{dataPoint.time}</span>
                      </div>
                      <div className="flex-1 mx-6">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className={`h-3 rounded-full transition-all duration-1000 ${
                            isPeak 
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 h-4 animate-pulse'
                              : index === 0 
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                : 'bg-gradient-to-r from-orange-400 to-orange-500'
                          }`} style={{ width: `${widthPercentage}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${
                          isPeak ? 'text-xl text-red-600 font-black' : 'text-lg text-orange-600'
                        }`}>{dataPoint.bpm} bpm</span>
                        {isPeak ? (
                          <div className="flex space-x-1">
                            <div className="text-lg animate-bounce">💘</div>
                            <div className="text-lg animate-pulse">💕</div>
                          </div>
                        ) : (
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 他の結果へのリンク */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                <Heart className="h-6 w-6 mr-3 text-pink-600 animate-bounce" />
                他の恋の結果も見る
                <div className="text-lg ml-3 animate-spin">💕</div>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link
                  href={`/results/${id}/excitement`}
                  className="group/card relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl blur opacity-75 group-hover/card:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 text-center group-hover/card:scale-105 transition-all duration-300 hover:shadow-lg">
                    <div className="text-4xl mb-4 animate-bounce">💕</div>
                    <div className="text-xl font-bold text-pink-700 mb-2">ドキドキ相手</div>
                    <div className="text-sm text-pink-600 font-medium">最もドキドキした相手</div>
                    <div className="mt-3 inline-flex items-center px-3 py-1 bg-pink-200 rounded-full">
                      <Heart className="w-4 h-4 text-pink-600 mr-1" />
                      <span className="text-xs font-semibold text-pink-700">💘 恋のドキドキ</span>
                    </div>
                  </div>
                </Link>
                
                <Link
                  href={`/results/${id}/proximity`}
                  className="group/card relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-75 group-hover/card:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center group-hover/card:scale-105 transition-all duration-300 hover:shadow-lg">
                    <div className="text-4xl mb-4 animate-bounce">👫</div>
                    <div className="text-xl font-bold text-blue-700 mb-2">最も近くにいた人</div>
                    <div className="text-sm text-blue-600 font-medium">平均距離が最も近い相手</div>
                    <div className="mt-3 inline-flex items-center px-3 py-1 bg-blue-200 rounded-full">
                      <Heart className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="text-xs font-semibold text-blue-700">💕 恋の距離</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
