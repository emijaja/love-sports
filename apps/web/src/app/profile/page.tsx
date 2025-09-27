import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import ProfileForm from './components/ProfileForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()

  // セッションを確認
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // ユーザー情報を取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, nickname, gender, bio, image_url, role')
    .eq('id', session.user.id)
    .single()

  // 参加者権限確認
  if (profile?.role !== 'user') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            ダッシュボードに戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">プロフィール編集</h1>
          <p className="mt-2 text-gray-600">あなたの情報を編集してください</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  )
}