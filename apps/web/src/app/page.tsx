import Link from 'next/link'
import { Heart, Users, Activity, Sparkles, Zap, Star, ArrowRight, Play } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* 背景の装飾要素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-6xl">
          {/* メインタイトルセクション */}
          <div className="mb-16">
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-2xl">
                <Heart className="h-16 w-16 text-pink-500 animate-bounce" />
                <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
              </div>
            </div>
            
            <h1 className="text-7xl sm:text-8xl font-black mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-pulse">
              Love Sports
            </h1>
            
            <div className="space-y-4 mb-12">
              <p className="text-2xl sm:text-3xl text-gray-700 font-semibold animate-fade-in">
                💓 心拍数で繋がる、新しい出会い 💓
              </p>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                デバイスを装着してスポーツを楽しむだけで、<br className="hidden sm:block" />
                特別な誰かとの出会いが待っています
              </p>
            </div>

            {/* ステータスバー */}
            <div className="flex items-center justify-center space-x-4 mb-12 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>リアルタイム計測中</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>10名参加中</span>
              </div>
            </div>
          </div>

          {/* 機能カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-10 w-10 text-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors">リアルタイム計測</h3>
                <p className="text-gray-600 leading-relaxed">
                  心拍数と距離データを10秒ごとにリアルタイムで計測し、<br />
                  ドキドキの瞬間を逃しません
                </p>
                <div className="mt-4 flex items-center justify-center text-pink-500 font-semibold">
                  <Zap className="w-4 h-4 mr-2" />
                  リアルタイム
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors">スマートマッチング</h3>
                <p className="text-gray-600 leading-relaxed">
                  心拍数と距離のデータをAIが分析し、<br />
                  最適なマッチングを自動算出します
                </p>
                <div className="mt-4 flex items-center justify-center text-purple-500 font-semibold">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI分析
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-10 w-10 text-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors">新しい出会い</h3>
                <p className="text-gray-600 leading-relaxed">
                  スポーツを通じた自然な出会いをサポートし、<br />
                  特別な瞬間を共有できます
                </p>
                <div className="mt-4 flex items-center justify-center text-indigo-500 font-semibold">
                  <Star className="w-4 h-4 mr-2" />
                  特別な出会い
                </div>
              </div>
            </div>
          </div>

          {/* 使い方のステップ */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
              🎯 使い方はとっても簡単！
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    1
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">デバイスを装着</h3>
                <p className="text-gray-600">
                  イベント会場で専用デバイスを受け取り、<br />
                  簡単に装着するだけ！
                </p>
              </div>

              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    2
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">スポーツを楽しむ</h3>
                <p className="text-gray-600">
                  心拍数と距離が自動で記録されます。<br />
                  楽しむだけでOK！
                </p>
              </div>

              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    3
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">結果を確認</h3>
                <p className="text-gray-600">
                  イベント終了後、特別な誰かとの<br />
                  出会いが待っています！
                </p>
              </div>
            </div>
          </div>

          {/* CTA ボタン */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/login"
              className="group relative inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <span className="relative flex items-center">
                <Heart className="w-6 h-6 mr-3 animate-pulse" />
                参加者としてログイン
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link
              href="/admin/login"
              className="group relative inline-flex items-center px-8 py-4 text-lg font-bold text-gray-700 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border-2 border-gray-200 hover:border-purple-300"
            >
              <span className="relative flex items-center">
                <Users className="w-6 h-6 mr-3" />
                管理者としてログイン
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* フッター */}
          <div className="mt-20 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
              <span className="text-2xl font-bold text-gray-800">Love Sports</span>
              <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
            </div>
            <p className="text-gray-600">
              心拍数と距離で繋がる、新しいスポーツマッチング体験
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
