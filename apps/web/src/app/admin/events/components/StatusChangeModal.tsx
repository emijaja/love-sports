'use client'

import { useState } from 'react'
import { X, Play, Pause, Square, Eye, Settings, Clock } from 'lucide-react'
import { updateEventStatus } from '../actions'

interface Event {
  id: string
  name: string
  status: string
  starts_at_ms: number
  ends_at_ms: number
}

interface StatusChangeModalProps {
  event: Event
  isOpen: boolean
  onClose: () => void
}

const statusOptions = [
  {
    value: 'preparing',
    label: '準備中',
    description: 'イベント準備段階',
    icon: Settings,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100'
  },
  {
    value: 'active',
    label: '開催中',
    description: 'イベント進行中',
    icon: Play,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100'
  },
  {
    value: 'interval',
    label: 'インターバル',
    description: '休憩・中断中',
    icon: Pause,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  {
    value: 'ended',
    label: '終了',
    description: 'イベント終了済み',
    icon: Square,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100'
  },
  {
    value: 'published',
    label: '結果公開中',
    description: '結果を参加者に公開中',
    icon: Eye,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100'
  }
]

export default function StatusChangeModal({ event, isOpen, onClose }: StatusChangeModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string>('')

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === event.status) {
      onClose()
      return
    }

    setIsUpdating(true)
    setError('')
    
    try {
      await updateEventStatus(event.id, newStatus)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ステータスの更新に失敗しました')
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* オーバーレイ */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* モーダル */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                ステータス変更
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                「{event.name}」のステータスを変更します
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>現在のステータス: </span>
              <span className="font-medium">
                {statusOptions.find(opt => opt.value === event.status)?.label || event.status}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2 mb-6">
            {statusOptions.map((option) => {
              const Icon = option.icon
              const isCurrentStatus = option.value === event.status
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusUpdate(option.value)}
                  disabled={isUpdating}
                  className={`w-full flex items-center p-3 rounded-lg border transition-colors ${
                    isCurrentStatus
                      ? 'border-gray-300 bg-gray-100 cursor-default'
                      : `border-gray-200 ${option.bgColor} hover:border-gray-300`
                  } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`flex-shrink-0 mr-3 ${option.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {option.label}
                      </div>
                      {isCurrentStatus && (
                        <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                          現在
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {option.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}