'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { usePollingTelemetry } from '@/hooks/usePollingTelemetry'
import { RefreshCw, Clock } from 'lucide-react'
import { useState } from 'react'

interface TelemetryPeerData {
  device_id: string
  peer_device_id: string
  timestamp_ms: number
  distance_m: number
}

interface DeviceAssignment {
  device_id: string
  participant_id: string
  profiles: {
    nickname: string | null
  } | null
}

interface PollingPeerDistanceChartsProps {
  eventId: string
  deviceAssignments: DeviceAssignment[]
  enabled?: boolean
}

export default function PollingPeerDistanceCharts({ 
  eventId, 
  deviceAssignments, 
  enabled = true 
}: PollingPeerDistanceChartsProps) {
  const { telemetryPeersData, isLoading, error, lastUpdate, refetch } = usePollingTelemetry({ 
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

  // ペア毎にデータをグループ化
  const pairData = new Map<string, TelemetryPeerData[]>()
  telemetryPeersData.forEach(data => {
    const participant1 = deviceToParticipant.get(data.device_id) || `デバイス ${data.device_id}`
    const participant2 = deviceToParticipant.get(data.peer_device_id) || `デバイス ${data.peer_device_id}`
    
    // ペア名を一意にするため、アルファベット順にソート
    const pairKey = [participant1, participant2].sort().join(' ⇔ ')
    
    if (!pairData.has(pairKey)) {
      pairData.set(pairKey, [])
    }
    pairData.get(pairKey)!.push(data)
  })

  // チャート用データを準備
  const prepareChartData = (data: TelemetryPeerData[]) => {
    return data
      .map(d => ({
        time: new Date(d.timestamp_ms).toLocaleTimeString('ja-JP', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
        distance: d.distance_m,
        timestamp: d.timestamp_ms
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-100) // 最新100件のみ表示
  }

  // 全体の距離分布データを準備
  const prepareDistributionData = () => {
    const distances = telemetryPeersData.map(d => d.distance_m)
    const buckets = [0, 2, 5, 10, 20, 50, 100, Infinity]
    const bucketCounts = new Array(buckets.length - 1).fill(0)
    const bucketLabels = ['0-2m', '2-5m', '5-10m', '10-20m', '20-50m', '50-100m', '100m+']

    distances.forEach(distance => {
      for (let i = 0; i < buckets.length - 1; i++) {
        if (distance >= buckets[i] && distance < buckets[i + 1]) {
          bucketCounts[i]++
          break
        }
      }
    })

    return bucketLabels.map((label, index) => ({
      range: label,
      count: bucketCounts[index]
    }))
  }

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ]

  const distributionData = prepareDistributionData()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">ピア距離グラフ</h2>
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

  if (pairData.size === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">ピア距離グラフ</h2>
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
          {isLoading ? 'データを読み込み中...' : '表示できるピア距離データがありません'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">ピア距離グラフ</h2>
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
      
      {/* 距離分布グラフ */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">距離分布</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip 
              labelFormatter={(value) => `距離範囲: ${value}`}
              formatter={(value: number) => [`${value}件`, '記録数']}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ペア毎の距離推移 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from(pairData.entries()).map(([pairName, data], index) => {
        const chartData = prepareChartData(data)
        const color = colors[index % colors.length]
        
        if (chartData.length === 0) {
          return null
        }

        // 統計情報を計算
        const distances = chartData.map(d => d.distance)
        const avgDistance = Math.round(distances.reduce((sum, d) => sum + d, 0) / distances.length * 10) / 10
        const minDistance = Math.min(...distances)
        const maxDistance = Math.max(...distances)
        const closeContactCount = distances.filter(d => d <= 2).length

        return (
          <div key={pairName} className="bg-white shadow-sm rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{pairName}</h3>
            
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={[0, 'dataMax + 5']}
                  fontSize={10}
                  width={40}
                />
                <Tooltip 
                  labelFormatter={(value) => `時刻: ${value}`}
                  formatter={(value: number) => [`${value}m`, '距離']}
                />
                <Line 
                  type="monotone" 
                  dataKey="distance" 
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
                {/* 2m以下の警告ライン */}
                <Line 
                  type="monotone" 
                  dataKey={() => 2}
                  stroke="#EF4444"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* 統計情報 */}
            <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-gray-200">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {avgDistance}m
                </div>
                <div className="text-xs text-gray-500">平均</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {minDistance}m
                </div>
                <div className="text-xs text-gray-500">最短</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {maxDistance}m
                </div>
                <div className="text-xs text-gray-500">最長</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${closeContactCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {closeContactCount}
                </div>
                <div className="text-xs text-gray-500">近接</div>
              </div>
            </div>
          </div>
        )
        })}
      </div>
    </div>
  )
}
