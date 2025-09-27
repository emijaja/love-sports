'use client'

import { useState } from 'react'
import { UserPlus, X, Users, Calendar, Smartphone } from 'lucide-react'

interface AssignDeviceFormProps {
  deviceId: string
  onAssign: (formData: FormData) => Promise<void>
  events: Array<{
    id: string
    name: string
    status: string
  }>
  users: Array<{
    id: string
    nickname: string
  }>
}

export default function AssignDeviceForm({ deviceId, onAssign, events, users }: AssignDeviceFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError('')
    
    try {
      formData.append('deviceId', deviceId)
      await onAssign(formData)
      setIsOpen(false)
      // フォームをリセット
      const form = document.getElementById(`assign-form-${deviceId}`) as HTMLFormElement
      form?.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // 利用可能なイベント（終了以外のすべて）
  const availableEvents = events.filter(event => 
    event.status !== 'ended'
  )

  return (
    <>
      {/* アサインボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-200 transition-colors"
      >
        <UserPlus className="h-3 w-3 mr-1" />
        アサイン
      </button>

      {/* モーダル */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">デバイスをアサイン</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form id={`assign-form-${deviceId}`} action={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* デバイス情報 */}
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">デバイス: {deviceId}</span>
                </div>
              </div>

              {/* イベント選択 */}
              <div>
                <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-1">
                  イベント *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    id="eventId"
                    name="eventId"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">イベントを選択してください</option>
                    {availableEvents.map((event) => {
                      const statusLabel = 
                        event.status === 'preparing' ? '準備中' :
                        event.status === 'active' ? 'アクティブ' :
                        event.status === 'interval' ? '休憩中' :
                        event.status === 'published' ? '公開済み' :
                        event.status
                      
                      return (
                        <option key={event.id} value={event.id}>
                          {event.name} ({statusLabel})
                        </option>
                      )
                    })}
                  </select>
                </div>
                {availableEvents.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    アサイン可能なイベントがありません
                  </p>
                )}
              </div>

              {/* ユーザー選択 */}
              <div>
                <label htmlFor="participantId" className="block text-sm font-medium text-gray-700 mb-1">
                  参加者 *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    id="participantId"
                    name="participantId"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">参加者を選択してください</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.nickname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ボタン */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isLoading || availableEvents.length === 0}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'アサイン中...' : 'アサイン'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}