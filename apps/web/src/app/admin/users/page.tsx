import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Crown, Shield } from 'lucide-react'
import { updateUserRole } from './actions'
import CreateUserForm from './create-user-form'

export default async function AdminUsersPage() {
  const supabase = await createServerSupabaseClient()

  // セッションを確認
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  // 管理者権限確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/admin/login')
  }

  // 全ユーザー取得
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, nickname, gender, role, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            管理画面に戻る
          </Link>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <User className="h-6 w-6 text-green-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
              </div>
              <CreateUserForm />
            </div>
            
            {/* 統計 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-blue-900">
                      {users?.length || 0}
                    </div>
                    <div className="text-sm text-blue-700">総ユーザー数</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Crown className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-purple-900">
                      {users?.filter(u => u.role === 'admin').length || 0}
                    </div>
                    <div className="text-sm text-purple-700">管理者</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-green-900">
                      {users?.filter(u => u.role === 'user').length || 0}
                    </div>
                    <div className="text-sm text-green-700">一般ユーザー</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ユーザーリスト */}
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ユーザー
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      性別
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      権限
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      登録日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users?.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.nickname || '未設定'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.gender || '未設定'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'admin' ? '管理者' : 'ユーザー'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(user.created_at).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <form action={updateUserRole} className="inline">
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="currentRole" value={user.role} />
                          <button
                            type="submit"
                            disabled={user.id === session.user.id}
                            className={`text-sm px-3 py-1 rounded-md transition-colors ${
                              user.id === session.user.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : user.role === 'admin'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {user.id === session.user.id 
                              ? '自分' 
                              : user.role === 'admin' 
                              ? 'ユーザーに変更' 
                              : '管理者に変更'
                            }
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {(!users || users.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  ユーザーが見つかりません
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}