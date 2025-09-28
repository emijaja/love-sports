'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface TelemetryData {
  device_id: string
  timestamp_ms: number
  heart_rate_bpm: number | null
  battery_pct: number | null
}

interface TelemetryPeerData {
  device_id: string
  peer_device_id: string
  timestamp_ms: number
  distance_m: number
}

interface UsePollingTelemetryProps {
  eventId: string
  enabled?: boolean
  intervalMs?: number
}

export function usePollingTelemetry({ 
  eventId, 
  enabled = true, 
  intervalMs = 2000 
}: UsePollingTelemetryProps) {
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([])
  const [telemetryPeersData, setTelemetryPeersData] = useState<TelemetryPeerData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // データ取得関数
  const fetchData = useCallback(async () => {
    if (!enabled || !eventId) return

    try {
      setIsLoading(true)
      setError(null)

      // テレメトリーデータを取得（最新100件のみ）
      const { data: telemetry, error: telemetryError } = await supabase
        .from('telemetry')
        .select('*')
        .eq('event_id', eventId)
        .order('timestamp_ms', { ascending: false })
        .limit(100)

      if (telemetryError) {
        console.error('Telemetry fetch error:', telemetryError)
        setError('テレメトリーデータの取得に失敗しました')
        return
      }

      // テレメトリーピアデータを取得（最新100件のみ）
      const { data: telemetryPeers, error: telemetryPeersError } = await supabase
        .from('telemetry_peers')
        .select('*')
        .eq('event_id', eventId)
        .order('timestamp_ms', { ascending: false })
        .limit(100)

      if (telemetryPeersError) {
        console.error('Telemetry peers fetch error:', telemetryPeersError)
        setError('ピア距離データの取得に失敗しました')
        return
      }

      // データの差分をチェック（最新のタイムスタンプで比較）
      const latestTelemetry = telemetry?.[0] // 降順でソートされているため最初の要素が最新
      const latestPeers = telemetryPeers?.[0]
      const prevLatestTelemetry = telemetryData[telemetryData.length - 1] // 昇順でソートされているため最後の要素が最新
      const prevLatestPeers = telemetryPeersData[0] // 降順でソートされているため最初の要素が最新
      
      const hasNewTelemetryData = latestTelemetry && (!prevLatestTelemetry || latestTelemetry.timestamp_ms > prevLatestTelemetry.timestamp_ms)
      const hasNewPeersData = latestPeers && (!prevLatestPeers || latestPeers.timestamp_ms > prevLatestPeers.timestamp_ms)
      
      // データが変更された場合のみ状態を更新
      if (hasNewTelemetryData || hasNewPeersData || telemetryData.length === 0) {
        // テレメトリーデータは時系列順にソート
        const sortedTelemetry = (telemetry || []).sort((a, b) => a.timestamp_ms - b.timestamp_ms)
        setTelemetryData(sortedTelemetry)
        setTelemetryPeersData(telemetryPeers || [])
        setLastUpdate(new Date())
      }
    } catch (err) {
      console.error('Data fetch error:', err)
      setError('データの取得中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }, [eventId, enabled, telemetryData, telemetryPeersData])

  // 初期データ取得
  useEffect(() => {
    if (enabled && eventId) {
      fetchData()
    }
  }, [eventId, enabled, fetchData])

  // ポーリング設定
  useEffect(() => {
    if (!enabled || !eventId) {
      return
    }

    const interval = setInterval(() => {
      fetchData()
    }, intervalMs)

    return () => {
      clearInterval(interval)
    }
  }, [enabled, eventId, intervalMs, fetchData])

  // メモ化された統計情報
  const stats = useMemo(() => {
    const telemetryCount = telemetryData.length
    const telemetryPeersCount = telemetryPeersData.length
    const activeDevices = new Set(telemetryData.map(d => d.device_id)).size
    
    return {
      telemetryCount,
      telemetryPeersCount,
      activeDevices
    }
  }, [telemetryData, telemetryPeersData])

  return {
    telemetryData,
    telemetryPeersData,
    isLoading,
    error,
    lastUpdate,
    stats,
    refetch: fetchData
  }
}
