import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()

  // セッションを確認
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  // ユーザー情報を取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Love Sports 管理画面
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600">
              ようこそ、{profile?.nickname || session.user.email}さん
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="/admin/events" className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
              <h3 className="font-semibold text-blue-900 mb-2">イベント管理</h3>
              <p className="text-sm text-blue-700">スポーツイベントの作成・編集・管理</p>
            </a>
            
            <a href="/admin/users" className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
              <h3 className="font-semibold text-green-900 mb-2">ユーザー管理</h3>
              <p className="text-sm text-green-700">参加者の情報管理</p>
            </a>
            
            <a href="/admin/devices" className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors">
              <h3 className="font-semibold text-purple-900 mb-2">デバイス管理</h3>
              <p className="text-sm text-purple-700">測定デバイスの管理・設定</p>
            </a>
          </div>

          <div className="mt-8">
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}