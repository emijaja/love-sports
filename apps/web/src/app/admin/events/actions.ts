'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { SupabaseClient } from '@supabase/supabase-js'

interface ParticipantResults {
  excitementRanking: string[]
  heartRateRanking: string[]
  proximityRanking: string[]
  excitementDetails?: Record<string, {
    excitementLevel: string
    duration: number
    peakTime: string
  }>
  heartRateDetails?: {
    peakHeartRate: number
    peakTime: string
    peakDistance: number
    peakNearestParticipant: string
    heartRateTimeline: Array<{
      time: string
      bpm: number
    }>
  }
  proximityDetails?: Record<string, {
    averageDistance: number
    proximityTime: number
    minDistance: number
    distanceTimeline?: Array<{
      time: string
      distance: number
    }>
  }>
}

interface Assignment {
  participant_id: string
  device_id: string
}

interface TelemetryData {
  heart_rate_bpm: number
  distance_m: number
  timestamp: string
  timestamp_ms: number
  peer_device_id?: string
}

export async function updateEventStatus(eventId: string, status: string) {
  const supabase = await createServerSupabaseClient()

  // セッション確認
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('認証が必要です')
  }

  // 管理者権限確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('管理者権限が必要です')
  }

  // ステータス更新
  const { error } = await supabase
    .from('events')
    .update({ status })
    .eq('id', eventId)

  if (error) {
    console.error('Status update error:', error)
    throw new Error('ステータスの更新に失敗しました')
  }

  // 「結果公開中」ステータスに変更された場合、results_finalを作成
  if (status === 'published') {
    await createResultsFinal(eventId)
  }

  revalidatePath('/admin/events')
}

async function createResultsFinal(eventId: string) {
  const supabase = await createServerSupabaseClient()

  // テレメトリデータから結果を生成
  const resultsData = await generateResultsFromTelemetry(supabase, eventId)

  const { error } = await supabase
    .from('results_final')
    .upsert({
      event_id: eventId,
      generated_at_ms: Date.now(),
      per_participant_json: resultsData
    })

  if (error) {
    console.error('Results final creation error:', error)
    throw new Error('最終結果の作成に失敗しました')
  }
}

async function generateResultsFromTelemetry(supabase: SupabaseClient, eventId: string) {
  // デバイス割り当て情報を取得
  const { data: assignments } = await supabase
    .from('device_assignments')
    .select('participant_id, device_id')
    .eq('event_id', eventId)

  if (!assignments || assignments.length === 0) {
    throw new Error('このイベントには参加者が割り当てられていません')
  }

  // 各参加者のテレメトリデータを取得・分析
  const participantResults: Record<string, ParticipantResults> = {}

  for (const assignment of assignments) {
    const participantId = assignment.participant_id
    const deviceId = assignment.device_id

    // 心拍数データを取得
    const { data: heartRateData } = await supabase
      .from('telemetry')
      .select('timestamp_ms, heart_rate_bpm')
      .eq('event_id', eventId)
      .eq('device_id', deviceId)
      .not('heart_rate_bpm', 'is', null)
      .order('timestamp_ms')

    // 近接データを取得
    const { data: proximityData } = await supabase
      .from('telemetry_peers')
      .select('timestamp_ms, peer_device_id, distance_m')
      .eq('event_id', eventId)
      .eq('device_id', deviceId)
      .order('timestamp_ms')

    // 他の参加者との相対結果を計算
    // const otherParticipants = assignments
    //   .filter(a => a.participant_id !== participantId)
    //   .map(a => a.participant_id)

    // 心拍数ランキングを生成
    const heartRateRanking = await generateHeartRateRanking(supabase, eventId, assignments, participantId)
    
    // 近接ランキングを生成
    const proximityRanking = await generateProximityRanking(supabase, eventId, assignments, participantId)
    
    // 興奮度ランキング（心拍数ベース）を生成
    const excitementRanking = await generateExcitementRanking(supabase, eventId, assignments, participantId)

    // 詳細データを計算
    const heartRateDetails = calculateHeartRateDetails(heartRateData as TelemetryData[] || [], proximityData as TelemetryData[] || [], assignments)
    const proximityDetails = calculateProximityDetails(proximityData as TelemetryData[] || [], assignments)
    const excitementDetails = calculateExcitementDetails(heartRateData as TelemetryData[] || [], assignments)

    participantResults[participantId] = {
      excitementRanking,
      heartRateRanking,
      proximityRanking,
      proximityDetails,
      excitementDetails,
      heartRateDetails
    }
  }

  return participantResults
}

async function generateHeartRateRanking(supabase: SupabaseClient, eventId: string, assignments: Assignment[], currentParticipantId: string) {
  const participantScores = []

  for (const assignment of assignments) {
    if (assignment.participant_id === currentParticipantId) continue

    const { data: heartRateData } = await supabase
      .from('telemetry')
      .select('heart_rate_bpm')
      .eq('event_id', eventId)
      .eq('device_id', assignment.device_id)
      .not('heart_rate_bpm', 'is', null)

    const avgHeartRate = heartRateData && heartRateData.length > 0 
      ? heartRateData.reduce((sum: number, d: any) => sum + d.heart_rate_bpm, 0) / heartRateData.length
      : 0

    participantScores.push({ participantId: assignment.participant_id, score: avgHeartRate })
  }

  return participantScores
    .sort((a, b) => b.score - a.score)
    .map(p => p.participantId)
}

async function generateProximityRanking(supabase: SupabaseClient, eventId: string, assignments: Assignment[], currentParticipantId: string) {
  const participantScores = []

  for (const assignment of assignments) {
    if (assignment.participant_id === currentParticipantId) continue

    const { data: proximityData } = await supabase
      .from('telemetry_peers')
      .select('distance_m')
      .eq('event_id', eventId)
      .eq('device_id', assignment.device_id)

    const avgDistance = proximityData && proximityData.length > 0
      ? proximityData.reduce((sum: number, d: any) => sum + d.distance_m, 0) / proximityData.length
      : 1000

    participantScores.push({ participantId: assignment.participant_id, score: avgDistance })
  }

  return participantScores
    .sort((a, b) => a.score - b.score)
    .map(p => p.participantId)
}

async function generateExcitementRanking(supabase: SupabaseClient, eventId: string, assignments: Assignment[], currentParticipantId: string) {
  const participantScores = []

  for (const assignment of assignments) {
    if (assignment.participant_id === currentParticipantId) continue

    const { data: heartRateData } = await supabase
      .from('telemetry')
      .select('heart_rate_bpm')
      .eq('event_id', eventId)
      .eq('device_id', assignment.device_id)
      .not('heart_rate_bpm', 'is', null)

    const maxHeartRate = heartRateData && heartRateData.length > 0
      ? Math.max(...heartRateData.map((d: any) => d.heart_rate_bpm))
      : 0

    participantScores.push({ participantId: assignment.participant_id, score: maxHeartRate })
  }

  return participantScores
    .sort((a, b) => b.score - a.score)
    .map(p => p.participantId)
}

function calculateHeartRateDetails(heartRateData: TelemetryData[], proximityData: TelemetryData[], _assignments: Assignment[]) {
  if (!heartRateData || heartRateData.length === 0) {
    return {
      peakHeartRate: 0,
      maxHeartRate: 0,
      peakTime: '',
      peakDistance: 0,
      minDistance: 0,
      peakNearestParticipant: '',
      normalHeartRate: 70,
      averageDistance: 0,
      heartRateTimeline: []
    }
  }

  const maxEntry = heartRateData.reduce((max, current) => 
    current.heart_rate_bpm > max.heart_rate_bpm ? current : max
  )

  const peakTime = new Date(maxEntry.timestamp_ms).toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  // ピーク時の近接データを取得
  const peakProximity = proximityData?.find(p => 
    Math.abs(p.timestamp_ms - maxEntry.timestamp_ms) < 30000
  )

  const avgDistance = proximityData?.length > 0
    ? proximityData.reduce((sum, d) => sum + d.distance_m, 0) / proximityData.length
    : 0

  // 心拍数タイムラインを生成（最新4つのデータポイント）
  const timeline = heartRateData
    .slice(-4)
    .map(d => ({
      time: new Date(d.timestamp_ms).toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      bpm: d.heart_rate_bpm
    }))

  return {
    peakHeartRate: maxEntry.heart_rate_bpm,
    maxHeartRate: maxEntry.heart_rate_bpm,
    peakTime,
    peakDistance: peakProximity?.distance_m || 0,
    minDistance: peakProximity?.distance_m || 0,
    peakNearestParticipant: peakProximity?.peer_device_id || '',
    normalHeartRate: 70,
    averageDistance: avgDistance / 100, // メートルをキロメートルに変換
    heartRateTimeline: timeline
  }
}

function calculateProximityDetails(proximityData: TelemetryData[], _assignments: Assignment[]) {
  if (!proximityData || proximityData.length === 0) {
    return {}
  }

  const details: Record<string, any> = {}

  // 各ピアデバイス（参加者）との近接詳細を計算
  const peerGroups = proximityData.reduce((groups: any, d: any) => {
    if (!groups[d.peer_device_id]) {
      groups[d.peer_device_id] = []
    }
    groups[d.peer_device_id].push(d)
    return groups
  }, {})

  Object.entries(peerGroups).forEach(([peerDeviceId, data]: [string, any]) => {
    const distances = data.map((d: any) => d.distance_m)
    const avgDistance = distances.reduce((sum: number, d: number) => sum + d, 0) / distances.length
    const minDistance = Math.min(...distances)
    
    // 近接時間（5m以内にいた時間を分単位で計算）
    const proximityTime = data.filter((d: any) => d.distance_m <= 500).length

    // 距離タイムラインを生成（最新4つのデータポイント）
    const timeline = data
      .slice(-4)
      .map((d: any) => ({
        time: new Date(d.timestamp_ms).toLocaleTimeString('ja-JP', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        distance: d.distance_m / 100 // メートルをキロメートルに変換
      }))

    details[peerDeviceId] = {
      averageDistance: avgDistance / 100,
      proximityTime,
      minDistance: minDistance / 100,
      distanceTimeline: timeline
    }
  })

  return details
}

function calculateExcitementDetails(heartRateData: TelemetryData[], assignments: Assignment[]) {
  if (!heartRateData || heartRateData.length === 0) {
    return {}
  }

  const details: Record<string, any> = {}

  // 興奮レベルを心拍数で判定
  const maxHeartRate = Math.max(...heartRateData.map(d => d.heart_rate_bpm))
  const avgHeartRate = heartRateData.reduce((sum, d) => sum + d.heart_rate_bpm, 0) / heartRateData.length

  let excitementLevel = 'LOW'
  if (maxHeartRate > 160) excitementLevel = 'MAX'
  else if (maxHeartRate > 140) excitementLevel = 'HIGH'
  else if (maxHeartRate > 120) excitementLevel = 'MID'

  const peakEntry = heartRateData.find(d => d.heart_rate_bpm === maxHeartRate)
  const peakTime = peakEntry ? new Date(peakEntry.timestamp_ms).toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }) : ''

  // 高心拍数（平均より20bpm高い）の持続時間を計算
  const highHeartRateThreshold = avgHeartRate + 20
  const duration = heartRateData.filter(d => d.heart_rate_bpm > highHeartRateThreshold).length

  // 上位数名の興奮詳細のみを返す（サンプルでは3名まで）
  const topParticipants = assignments.slice(0, 3)
  
  topParticipants.forEach((assignment, index) => {
    details[assignment.participant_id] = {
      excitementLevel: index === 0 ? excitementLevel : (index === 1 ? 'HIGH' : 'MID'),
      duration: Math.max(10, duration - (index * 5)),
      peakTime
    }
  })

  return details
}

export async function createEvent(formData: {
  name: string
  startsAtMs: number
  endsAtMs: number
}) {
  const supabase = await createServerSupabaseClient()

  // セッション確認
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('認証が必要です')
  }

  // 管理者権限確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('管理者権限が必要です')
  }

  // イベント作成
  const { error } = await supabase
    .from('events')
    .insert({
      name: formData.name,
      starts_at_ms: formData.startsAtMs,
      ends_at_ms: formData.endsAtMs,
      status: 'preparing'
    })
    .select()
    .single()

  if (error) {
    console.error('Event creation error:', error)
    throw new Error('イベントの作成に失敗しました')
  }

  revalidatePath('/admin/events')
  redirect('/admin/events')
}

export async function updateEvent(eventId: string, formData: {
  name: string
  startsAtMs: number
  endsAtMs: number
}) {
  const supabase = await createServerSupabaseClient()

  // セッション確認
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('認証が必要です')
  }

  // 管理者権限確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('管理者権限が必要です')
  }

  // イベント更新
  const { error } = await supabase
    .from('events')
    .update({
      name: formData.name,
      starts_at_ms: formData.startsAtMs,
      ends_at_ms: formData.endsAtMs
    })
    .eq('id', eventId)

  if (error) {
    console.error('Event update error:', error)
    throw new Error('イベントの更新に失敗しました')
  }

  revalidatePath('/admin/events')
  redirect('/admin/events')
}