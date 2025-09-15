'use client'

import Link from 'next/link'
import { Edit, Settings } from 'lucide-react'
import { useState } from 'react'
import StatusChangeModal from './StatusChangeModal'

interface Event {
  id: string
  name: string
  status: string
  starts_at_ms: number
  ends_at_ms: number
}

interface EventActionsProps {
  event: Event
}

export default function EventActions({ event }: EventActionsProps) {
  const [showStatusModal, setShowStatusModal] = useState(false)

  return (
    <>
      <div className="flex items-center space-x-2">
        <Link
          href={`/admin/events/${event.id}/edit`}
          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
          title="編集"
        >
          <Edit className="h-4 w-4" />
        </Link>

        <button
          onClick={() => setShowStatusModal(true)}
          className="text-gray-600 hover:text-gray-900 p-1 rounded"
          title="ステータス変更"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <StatusChangeModal
        event={event}
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      />
    </>
  )
}