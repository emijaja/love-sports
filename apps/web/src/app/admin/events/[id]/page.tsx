import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Activity, Wifi } from 'lucide-react'
import EventStatusBadge from '../components/EventStatusBadge'
import ParticipantCharts from './components/ParticipantCharts'
import PeerDistanceCharts from './components/PeerDistanceCharts'


export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  // イベント詳細を取得
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (eventError || !event) {
    redirect('/admin/events')
  }

  // デバイス割り当てを取得
  const { data: deviceAssignments } = await supabase
    .from('device_assignments')
    .select(`
      device_id,
      participant_id,
      profiles:participant_id (
        nickname
      )
    `)
    .eq('event_id', id)

  // テレメトリーデータを取得
  const { data: telemetryData, error: telemetryError } = await supabase
    .from('telemetry')
    .select('*')
    .eq('event_id', id)
    .order('timestamp_ms', { ascending: true })

  // テレメトリーピアデータを取得
  const { data: telemetryPeersData, error: telemetryPeersError } = await supabase
    .from('telemetry_peers')
    .select('*')
    .eq('event_id', id)
    .order('timestamp_ms', { ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin/events"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              イベント一覧に戻る
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
              <div className="mt-2 flex items-center gap-4 text-gray-600">
                <span>開始: {new Date(event.starts_at_ms).toLocaleString('ja-JP')}</span>
                <span>終了: {new Date(event.ends_at_ms).toLocaleString('ja-JP')}</span>
                <EventStatusBadge status={event.status} />
              </div>
            </div>
            <Link
              href={`/admin/events/${event.id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              編集
            </Link>
          </div>
        </div>

        {/* 参加者別グラフ */}
        <div className="mb-8">
          <ParticipantCharts 
            telemetryData={telemetryData || []} 
            deviceAssignments={(deviceAssignments || []).map(assignment => ({
              device_id: assignment.device_id,
              participant_id: assignment.participant_id,
              profiles: Array.isArray(assignment.profiles) 
                ? assignment.profiles[0] || { nickname: null }
                : assignment.profiles
            }))}
          />
        </div>

        {/* ピア距離グラフ */}
        <div className="mb-8">
          <PeerDistanceCharts 
            telemetryPeersData={telemetryPeersData || []} 
            deviceAssignments={(deviceAssignments || []).map(assignment => ({
              device_id: assignment.device_id,
              participant_id: assignment.participant_id,
              profiles: Array.isArray(assignment.profiles) 
                ? assignment.profiles[0] || { nickname: null }
                : assignment.profiles
            }))}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* テレメトリーデータ */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-green-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">テレメトリーデータ</h2>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                心拍数情報 (最新100件)
              </p>
            </div>
            <div className="p-6">
              {telemetryError ? (
                <div className="text-red-600">データの取得に失敗しました</div>
              ) : !telemetryData || telemetryData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  テレメトリーデータがありません
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-700">デバイス</th>
                        <th className="text-left py-2 font-medium text-gray-700">時刻</th>
                        <th className="text-left py-2 font-medium text-gray-700">心拍数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {telemetryData.map((data, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 text-gray-900">{data.device_id}</td>
                          <td className="py-2 text-gray-600">
                            {new Date(data.timestamp_ms).toLocaleString('ja-JP')}
                          </td>
                          <td className="py-2">
                            {data.heart_rate_bpm ? (
                              <span className="text-red-600 font-medium">
                                {data.heart_rate_bpm} bpm
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* テレメトリーピアデータ */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Wifi className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">ピア距離データ</h2>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                デバイス間の距離情報 (最新100件)
              </p>
            </div>
            <div className="p-6">
              {telemetryPeersError ? (
                <div className="text-red-600">データの取得に失敗しました</div>
              ) : !telemetryPeersData || telemetryPeersData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  ピア距離データがありません
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-700">デバイス</th>
                        <th className="text-left py-2 font-medium text-gray-700">ピア</th>
                        <th className="text-left py-2 font-medium text-gray-700">時刻</th>
                        <th className="text-left py-2 font-medium text-gray-700">距離</th>
                      </tr>
                    </thead>
                    <tbody>
                      {telemetryPeersData.map((data, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 text-gray-900">{data.device_id}</td>
                          <td className="py-2 text-gray-900">{data.peer_device_id}</td>
                          <td className="py-2 text-gray-600">
                            {new Date(data.timestamp_ms).toLocaleString('ja-JP')}
                          </td>
                          <td className="py-2">
                            <span className={`font-medium ${
                              data.distance_m < 2 ? 'text-red-600' : 
                              data.distance_m < 10 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {data.distance_m}m
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">テレメトリー記録数</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {telemetryData?.length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Wifi className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">ピア距離記録数</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {telemetryPeersData?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">アクティブデバイス数</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {telemetryData ? new Set(telemetryData.map(d => d.device_id)).size : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}