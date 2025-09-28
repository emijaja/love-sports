'use client'

import { usePollingTelemetry } from '@/hooks/usePollingTelemetry'
import PollingParticipantCharts from './PollingParticipantCharts'
import PollingPeerDistanceCharts from './PollingPeerDistanceCharts'

interface DeviceAssignment {
  device_id: string
  participant_id: string
  profiles: {
    nickname: string | null
  } | null
}

interface RealtimeChartsContainerProps {
  eventId: string
  deviceAssignments: DeviceAssignment[]
  enabled?: boolean
}

export default function RealtimeChartsContainer({ 
  eventId, 
  deviceAssignments, 
  enabled = true 
}: RealtimeChartsContainerProps) {
  // 1つのフックでデータを管理
  const { 
    telemetryData, 
    telemetryPeersData, 
    isLoading, 
    error, 
    lastUpdate, 
    refetch 
  } = usePollingTelemetry({ 
    eventId, 
    enabled,
    intervalMs: 10000 // 10秒ごと（パフォーマンス改善）
  })

  return (
    <>
      {/* 参加者別グラフ */}
      <div className="mb-8">
        <PollingParticipantCharts 
          eventId={eventId}
          deviceAssignments={deviceAssignments}
          enabled={false} // ポーリングは親コンポーネントで実行
          // データを直接渡す
          telemetryData={telemetryData}
          isLoading={isLoading}
          error={error}
          lastUpdate={lastUpdate}
          refetch={refetch}
        />
      </div>

      {/* ピア距離グラフ */}
      <div className="mb-8">
        <PollingPeerDistanceCharts 
          eventId={eventId}
          deviceAssignments={deviceAssignments}
          enabled={false} // ポーリングは親コンポーネントで実行
          // データを直接渡す
          telemetryPeersData={telemetryPeersData}
          isLoading={isLoading}
          error={error}
          lastUpdate={lastUpdate}
          refetch={refetch}
        />
      </div>
    </>
  )
}
