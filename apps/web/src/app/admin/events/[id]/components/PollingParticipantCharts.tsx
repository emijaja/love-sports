'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { usePollingTelemetry } from '@/hooks/usePollingTelemetry'
import { RefreshCw, Clock } from 'lucide-react'
import { useState } from 'react'

interface TelemetryData {
  device_id: string
  timestamp_ms: number
  heart_rate_bpm: number | null
  battery_pct: number | null
}

interface DeviceAssignment {
  device_id: string
  participant_id: string
  profiles: {
    nickname: string | null
  } | null
}

interface PollingParticipantChartsProps {
  eventId: string
  deviceAssignments: DeviceAssignment[]
  enabled?: boolean
}

export default function PollingParticipantCharts({ 
  eventId, 
  deviceAssignments, 
  enabled = true 
}: PollingParticipantChartsProps) {
  const { telemetryData, isLoading, error, lastUpdate, refetch } = usePollingTelemetry({ 
    eventId, 
    enabled,
    intervalMs: 2000 // 2秒ごと
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  // デバイスIDから参加者名へのマッピングを作成
  const deviceToParticipant = new Map<string, string>()
  deviceAssignments.forEach(assignment => {
    const nickname = assignment.profiles?.nickname || `参加者 ${assignment.participant_id.slice(0, 8)}`
    deviceToParticipant.set(assignment.device_id, nickname)
  })

  // 参加者ごとにデータをグループ化
  const participantData = new Map<string, TelemetryData[]>()
  telemetryData.forEach(data => {
    const participantName = deviceToParticipant.get(data.device_id) || `デバイス ${data.device_id}`
    if (!participantData.has(participantName)) {
      participantData.set(participantName, [])
    }
    participantData.get(participantName)!.push(data)
  })

  // チャート用データを準備
  const prepareChartData = (data: TelemetryData[]) => {
    return data
      .filter(d => d.heart_rate_bpm !== null)
      .map(d => ({
        time: new Date(d.timestamp_ms).toLocaleTimeString('ja-JP', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
        heartRate: d.heart_rate_bpm
      }))
      .slice(-50) // 最新50件のみ表示
  }

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">参加者別グラフ</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-red-600">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">エラー</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      </div>
    )
  }

  if (participantData.size === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">参加者別グラフ</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-blue-600">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">2秒ごと更新中</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        <div className="text-center py-8 text-gray-500">
          {isLoading ? 'データを読み込み中...' : '表示できるデータがありません'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">参加者別グラフ</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-blue-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">2秒ごと更新中</span>
            {isLoading && <RefreshCw className="h-3 w-3 ml-1 animate-spin" />}
          </div>
          {lastUpdate && (
            <div className="text-xs text-gray-500">
              最終更新: {lastUpdate.toLocaleTimeString('ja-JP')}
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            title="データを更新"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {Array.from(participantData.entries()).map(([participantName, data], index) => {
        const chartData = prepareChartData(data)
        const color = colors[index % colors.length]
        
        if (chartData.length === 0) {
          return (
            <div key={participantName} className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{participantName}</h3>
              <div className="text-center py-8 text-gray-500">
                心拍数データがありません
              </div>
            </div>
          )
        }

        return (
          <div key={participantName} className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{participantName}</h3>
            
            {/* 心拍数グラフ */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">心拍数 (BPM)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    domain={['dataMin - 10', 'dataMax + 10']}
                    fontSize={12}
                  />
                  <Tooltip 
                    labelFormatter={(value) => `時刻: ${value}`}
                    formatter={(value: number) => [`${value} bpm`, '心拍数']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke={color}
                    strokeWidth={2}
                    dot={{ fill: color, strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 統計情報 */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + (d.heartRate || 0), 0) / chartData.length) : '-'}
                </div>
                <div className="text-sm text-gray-500">平均心拍数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {chartData.length > 0 ? Math.max(...chartData.map(d => d.heartRate || 0)) : '-'}
                </div>
                <div className="text-sm text-gray-500">最大心拍数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {chartData.length > 0 ? Math.min(...chartData.map(d => d.heartRate || 0)) : '-'}
                </div>
                <div className="text-sm text-gray-500">最小心拍数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {chartData.length}
                </div>
                <div className="text-sm text-gray-500">データ件数</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
