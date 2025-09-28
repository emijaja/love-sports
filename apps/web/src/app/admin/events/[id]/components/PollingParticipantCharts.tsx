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
  // データを直接受け取る場合のプロパティ
  telemetryData?: TelemetryData[]
  isLoading?: boolean
  error?: string | null
  lastUpdate?: Date | null
  refetch?: () => Promise<void>
}

export default function PollingParticipantCharts({ 
  eventId, 
  deviceAssignments, 
  enabled = true,
  // データを直接受け取る場合
  telemetryData: propTelemetryData,
  isLoading: propIsLoading,
  error: propError,
  lastUpdate: propLastUpdate,
  refetch: propRefetch
}: PollingParticipantChartsProps) {
  // データが直接渡された場合はそれを使用、そうでなければポーリングフックを使用
  const hookData = usePollingTelemetry({ 
    eventId, 
    enabled: enabled && !propTelemetryData, // データが直接渡された場合はポーリングを無効化
    intervalMs: 2000
  })
  
  const telemetryData = propTelemetryData || hookData.telemetryData
  const isLoading = propIsLoading ?? hookData.isLoading
  const error = propError ?? hookData.error
  const lastUpdate = propLastUpdate ?? hookData.lastUpdate
  const refetch = propRefetch || hookData.refetch
  
  const [isRefreshing, setIsRefreshing] = useState(false)


  // デバイスIDから参加者名へのマッピングを作成（順序を保持）
  const deviceToParticipant = new Map<string, { name: string, deviceId: string }>()
  const participantOrder: { name: string, deviceId: string }[] = [] // 参加者の表示順序を保持
  
  // デバイスIDでソートしてから順序を記録
  const sortedAssignments = [...deviceAssignments].sort((a, b) => a.device_id.localeCompare(b.device_id))
  
  sortedAssignments.forEach(assignment => {
    const nickname = assignment.profiles?.nickname || `参加者 ${assignment.participant_id.slice(0, 8)}`
    const participantInfo = { name: nickname, deviceId: assignment.device_id }
    deviceToParticipant.set(assignment.device_id, participantInfo)
    participantOrder.push(participantInfo) // 順序を記録
  })

  // 参加者ごとにデータをグループ化（各人ごとの直近30件）
  const participantData = new Map<string, TelemetryData[]>()
  
  // まず、各参加者のデータを時系列順にソートして最新30件を取得
  const dataByDevice = new Map<string, TelemetryData[]>()
  telemetryData.forEach(data => {
    if (!dataByDevice.has(data.device_id)) {
      dataByDevice.set(data.device_id, [])
    }
    dataByDevice.get(data.device_id)!.push(data)
  })
  
  // 各デバイスのデータを時系列順にソートして最新15件を取得
  dataByDevice.forEach((deviceData, deviceId) => {
    const participantInfo = deviceToParticipant.get(deviceId) || { name: `デバイス ${deviceId}`, deviceId }
    const sortedData = deviceData
      .sort((a, b) => a.timestamp_ms - b.timestamp_ms)
      .slice(-15) // 最新15件
    participantData.set(participantInfo.name, sortedData)
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
              <span className="text-sm">10秒ごと更新中</span>
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
            <span className="text-sm">10秒ごと更新中</span>
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
      
      {participantOrder.map((participantInfo, index) => {
        const data = participantData.get(participantInfo.name) || []
        const chartData = prepareChartData(data)
        const color = colors[index % colors.length]
        
        if (chartData.length === 0) {
          return (
            <div key={participantInfo.name} className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {participantInfo.name}
                <span className="text-sm text-gray-500 ml-2">(ID: {participantInfo.deviceId})</span>
              </h3>
              <div className="text-center py-8 text-gray-500">
                心拍数データがありません
              </div>
            </div>
          )
        }

        return (
          <div key={participantInfo.name} className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {participantInfo.name}
              <span className="text-sm text-gray-500 ml-2">(ID: {participantInfo.deviceId})</span>
            </h3>
            
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
