import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// リクエストデータのバリデーションスキーマ
const TelemetryRequestSchema = z.object({
  deviceId: z.string().min(1, 'デバイスIDは必須です'),
  nearbyDeviceId: z.string().min(1, '近くのデバイスIDは必須です'),
  distance: z.number().min(0, '距離は0以上である必要があります'),
  heartRate: z.number().min(30).max(250, '心拍数は30-250の範囲である必要があります'),
})

// type TelemetryRequest = z.infer<typeof TelemetryRequestSchema>

// Supabaseクライアント
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.json()
    
    // データバリデーション
    const validatedData = TelemetryRequestSchema.parse(body)
    
    const { deviceId, nearbyDeviceId, distance, heartRate } = validatedData
    
    // 現在のタイムスタンプ（ミリ秒）
    const timestampMs = Date.now()
    
    // device_assignmentsから最新の割り当て情報を取得
    const { data: deviceAssignments, error: assignmentError } = await supabase
      .from('device_assignments')
      .select('*')
      .eq('device_id', deviceId)
      .order('assigned_at', { ascending: false })
      .limit(1)
    
    if (assignmentError) {
      console.error('デバイス割り当て取得エラー:', assignmentError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'デバイス割り当て情報の取得に失敗しました' 
        },
        { status: 500 }
      )
    }
    
    if (!deviceAssignments || deviceAssignments.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'デバイスIDに対応する割り当て情報が見つかりません',
          deviceId 
        },
        { status: 404 }
      )
    }
    
    const assignment = deviceAssignments[0]
    
    // telemetryテーブルに心拍数データを挿入
    const { error: telemetryError } = await supabase
      .from('telemetry')
      .insert({
        event_id: assignment.event_id,
        device_id: assignment.device_id,
        timestamp_ms: timestampMs,
        heart_rate_bpm: heartRate,
        battery_pct: null, // 一旦null
      })
    
    if (telemetryError) {
      console.error('テレメトリデータ挿入エラー:', telemetryError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'テレメトリデータの保存に失敗しました' 
        },
        { status: 500 }
      )
    }
    
    // telemetry_peersテーブルに距離データを挿入
    const { error: peersError } = await supabase
      .from('telemetry_peers')
      .insert({
        event_id: assignment.event_id,
        device_id: assignment.device_id,
        peer_device_id: nearbyDeviceId,
        timestamp_ms: timestampMs,
        distance_m: Math.round(distance), // メートル単位で保存（小数点以下は四捨五入）
      })
    
    if (peersError) {
      console.error('テレメトリピアデータ挿入エラー:', peersError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'テレメトリピアデータの保存に失敗しました' 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'テレメトリデータが正常に保存されました',
      data: {
        eventId: assignment.event_id,
        deviceId: assignment.device_id,
        timestampMs,
        heartRate,
        nearbyDeviceId,
        distance: Math.round(distance),
      }
    })
    
  } catch (error) {
    console.error('テレメトリデータ保存エラー:', error)
    
    // バリデーションエラーの場合
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'データの形式が正しくありません',
          details: error.issues 
        },
        { status: 400 }
      )
    }
    
    // その他のエラー
    return NextResponse.json(
      { 
        success: false, 
        error: 'サーバー内部エラーが発生しました' 
      },
      { status: 500 }
    )
  }
}

// OPTIONSメソッドでCORS対応
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
