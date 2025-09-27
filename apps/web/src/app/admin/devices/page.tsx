import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Smartphone, Wifi, WifiOff, Users, Calendar, UserMinus } from 'lucide-react'
import { deleteDevice, assignDevice, unassignDevice } from './actions'
import AddDeviceForm from './add-device-form'
import AssignDeviceForm from './assign-device-form'

interface Assignment {
  device_id: string
  event_id: string
  participant_id: string
  assigned_at: string
  events?: {
    name: string
    status: string
  }
  profiles?: {
    nickname: string
  }
}

export default async function AdminDevicesPage() {
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

  // デバイス一覧を取得
  const { data: devices, error: devicesError } = await supabase
    .from('devices')
    .select('*')
    .order('registered_at', { ascending: false })

  if (devicesError) {
    console.error('Error fetching devices:', devicesError)
  }

  // デバイス割り当て情報を取得
  const { data: assignments } = await supabase
    .from('device_assignments')
    .select(`
      *,
      events:events(name, status),
      profiles:profiles(nickname)
    `)

  // イベント一覧を取得
  const { data: events } = await supabase
    .from('events')
    .select('id, name, status')
    .order('created_at', { ascending: false })

  // ユーザー一覧を取得
  const { data: users } = await supabase
    .from('profiles')
    .select('id, nickname')
    .eq('role', 'user')
    .order('nickname')

  // デバイスごとの割り当て状況をマップ化
  const deviceAssignments = new Map<string, Assignment[]>()
  assignments?.forEach((assignment) => {
    if (!deviceAssignments.has(assignment.device_id)) {
      deviceAssignments.set(assignment.device_id, [])
    }
    deviceAssignments.get(assignment.device_id)?.push(assignment as Assignment)
  })

  // 統計情報
  const totalDevices = devices?.length || 0
  const activeAssignmentDevices = assignments?.filter(a => 
    a.events && a.events.status !== 'ended'
  ).map(a => a.device_id) || []
  const assignedDevices = new Set(activeAssignmentDevices).size
  const availableDevices = totalDevices - assignedDevices

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
                <Smartphone className="h-6 w-6 text-purple-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">デバイス管理</h1>
              </div>
              <AddDeviceForm />
            </div>
            
            {/* 統計 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-blue-900">
                      {totalDevices}
                    </div>
                    <div className="text-sm text-blue-700">総デバイス数</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Wifi className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-green-900">
                      {assignedDevices}
                    </div>
                    <div className="text-sm text-green-700">割り当て済み</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <WifiOff className="h-5 w-5 text-gray-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {availableDevices}
                    </div>
                    <div className="text-sm text-gray-700">利用可能</div>
                  </div>
                </div>
              </div>
            </div>

            {/* デバイスリスト */}
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      デバイスID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      メモ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      現在の割り当て
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
                  {devices?.map((device) => {
                    const assignments = deviceAssignments.get(device.id) || []
                    const activeAssignments = assignments.filter((a: Assignment) => 
                      a.events && a.events.status !== 'ended'
                    )
                    const isAssigned = activeAssignments.length > 0

                    return (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Smartphone className="h-5 w-5 text-purple-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {device.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {device.note || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isAssigned
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {isAssigned ? '使用中' : '利用可能'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {activeAssignments.length > 0 ? (
                            <div className="space-y-1">
                              {activeAssignments.map((assignment: Assignment, index: number) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Users className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs">{assignment.profiles?.nickname}</span>
                                  <Calendar className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs">{assignment.events?.name}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(device.registered_at).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {/* アサインボタン */}
                            {!isAssigned && (
                              <AssignDeviceForm
                                deviceId={device.id}
                                onAssign={assignDevice}
                                events={events || []}
                                users={users || []}
                              />
                            )}
                            
                            {/* アサイン解除ボタン */}
                            {isAssigned && activeAssignments.map((assignment: Assignment, index: number) => (
                              <form key={index} action={unassignDevice} className="inline">
                                <input type="hidden" name="eventId" value={assignment.event_id} />
                                <input type="hidden" name="deviceId" value={device.id} />
                                <button
                                  type="submit"
                                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-md hover:bg-orange-200 transition-colors"
                                >
                                  <UserMinus className="h-3 w-3 mr-1" />
                                  解除
                                </button>
                              </form>
                            ))}
                            
                            {/* 削除ボタン */}
                            <form action={deleteDevice} className="inline">
                              <input type="hidden" name="deviceId" value={device.id} />
                              <button
                                type="submit"
                                disabled={isAssigned}
                                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                                  isAssigned
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                {isAssigned ? '使用中' : '削除'}
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              
              {(!devices || devices.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  デバイスが登録されていません
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}