import Link from 'next/link'
import { Heart, Users, Activity } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 p-8">
      <main className="text-center max-w-4xl">
        <div className="mb-8">
          <div className="mx-auto h-16 w-16 bg-pink-200 rounded-full flex items-center justify-center mb-6">
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Love Sports
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            スポーツイベント向けリアルタイムマッチングシステム
          </p>
          <p className="text-lg text-gray-500 mb-12">
            心拍数と距離データで新しい出会いを創造
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <Activity className="h-8 w-8 text-pink-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">リアルタイム計測</h3>
            <p className="text-sm text-gray-600">心拍数と距離データをリアルタイムで計測</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">スマートマッチング</h3>
            <p className="text-sm text-gray-600">データに基づいた科学的なマッチング</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <Heart className="h-8 w-8 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">新しい出会い</h3>
            <p className="text-sm text-gray-600">スポーツを通じた自然な出会いをサポート</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors"
          >
            参加者ログイン
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            管理者ログイン
          </Link>
        </div>
      </main>
    </div>
  );
}
