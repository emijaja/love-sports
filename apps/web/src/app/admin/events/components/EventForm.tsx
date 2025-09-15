'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Calendar, Clock, Type } from 'lucide-react'
import Link from 'next/link'
import { createEvent, updateEvent } from '../actions'

const eventSchema = z.object({
  name: z
    .string()
    .min(1, 'イベント名を入力してください')
    .max(100, 'イベント名は100文字以内で入力してください'),
  startDate: z
    .string()
    .min(1, '開始日を入力してください'),
  startTime: z
    .string()
    .min(1, '開始時間を入力してください'),
  endDate: z
    .string()
    .min(1, '終了日を入力してください'),
  endTime: z
    .string()
    .min(1, '終了時間を入力してください'),
}).refine((data) => {
  const startDateTime = new Date(`${data.startDate}T${data.startTime}`)
  const endDateTime = new Date(`${data.endDate}T${data.endTime}`)
  return startDateTime < endDateTime
}, {
  message: '終了日時は開始日時より後に設定してください',
  path: ['endDate']
})

type EventForm = z.infer<typeof eventSchema>

interface EventFormProps {
  event?: {
    id: string
    name: string
    starts_at_ms: number
    ends_at_ms: number
  }
}

export default function EventForm({ event }: EventFormProps) {
  const [error, setError] = useState<string>('')
  const isEditing = !!event

  // 初期値の設定
  const getDefaultValues = () => {
    if (!event) {
      return {
        name: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
      }
    }

    const startDate = new Date(event.starts_at_ms)
    const endDate = new Date(event.ends_at_ms)

    return {
      name: event.name,
      startDate: startDate.toISOString().split('T')[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endDate: endDate.toISOString().split('T')[0],
      endTime: endDate.toTimeString().slice(0, 5)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: getDefaultValues()
  })

  const onSubmit = async (data: EventForm) => {
    setError('')
    try {
      const startsAtMs = new Date(`${data.startDate}T${data.startTime}`).getTime()
      const endsAtMs = new Date(`${data.endDate}T${data.endTime}`).getTime()

      const formData = {
        name: data.name,
        startsAtMs,
        endsAtMs
      }

      if (isEditing) {
        await updateEvent(event.id, formData)
      } else {
        await createEvent(formData)
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        return
      }
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          イベント名
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Type className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('name')}
            type="text"
            className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.name
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="例: ドッチボール大会"
          />
        </div>
        {errors.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            開始日時
          </label>
          <div className="space-y-3">
            <div>
              <label htmlFor="startDate" className="block text-xs text-gray-500 mb-1">
                開始日
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('startDate')}
                  type="date"
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.startDate
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="startTime" className="block text-xs text-gray-500 mb-1">
                開始時間
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('startTime')}
                  type="time"
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.startTime
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            終了日時
          </label>
          <div className="space-y-3">
            <div>
              <label htmlFor="endDate" className="block text-xs text-gray-500 mb-1">
                終了日
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('endDate')}
                  type="date"
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.endDate
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="endTime" className="block text-xs text-gray-500 mb-1">
                終了時間
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('endTime')}
                  type="time"
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.endTime
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Link
          href="/admin/events"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          キャンセル
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '保存中...' : isEditing ? '更新' : '作成'}
        </button>
      </div>
    </form>
  )
}