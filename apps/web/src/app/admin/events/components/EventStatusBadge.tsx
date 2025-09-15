'use client'

interface EventStatusBadgeProps {
  status: string
}

const statusConfig = {
  preparing: {
    label: '準備中',
    className: 'bg-yellow-100 text-yellow-800'
  },
  active: {
    label: '開催中',
    className: 'bg-green-100 text-green-800'
  },
  interval: {
    label: 'インターバル',
    className: 'bg-blue-100 text-blue-800'
  },
  ended: {
    label: '終了',
    className: 'bg-gray-100 text-gray-800'
  },
  published: {
    label: '結果公開中',
    className: 'bg-purple-100 text-purple-800'
  }
}

export default function EventStatusBadge({ status }: EventStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    className: 'bg-gray-100 text-gray-800'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}