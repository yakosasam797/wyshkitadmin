import { AlertCircle, Clock, Truck, AlertTriangle, User, Shield } from 'lucide-react'
import './PriorityTag.css'

interface PriorityTagProps {
  tag: string
  variant?: 'critical' | 'warning' | 'info'
}

const tagConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
  'SLA Breach': {
    icon: AlertCircle,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  'Preview Overdue': {
    icon: Clock,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  'Preview At Risk': {
    icon: Clock,
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  FRESH: {
    icon: AlertTriangle,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  'Fresh SLA Breached': {
    icon: AlertCircle,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  'Fresh High Risk': {
    icon: AlertTriangle,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  'Fresh Delivery Urgent': {
    icon: Truck,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  'Delivery Delay': {
    icon: Truck,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  'RTO Initiated': {
    icon: Truck,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  'Complaint Raised': {
    icon: User,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  'Vendor Delay': {
    icon: Clock,
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
}

export default function PriorityTag({ tag, variant }: PriorityTagProps) {
  const config = tagConfig[tag] || {
    icon: Shield,
    color: '#6b7280',
    bgColor: '#f3f4f6',
  }

  const Icon = config.icon
  const finalVariant = variant || (tag.includes('Breach') || tag.includes('Overdue') || tag === 'FRESH' ? 'critical' : tag.includes('Risk') || tag.includes('Delay') ? 'warning' : 'info')

  return (
    <span
      className={`priority-tag priority-tag-${finalVariant}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
      }}
    >
      <Icon className="priority-tag-icon" />
      <span className="priority-tag-text">{tag}</span>
    </span>
  )
}

