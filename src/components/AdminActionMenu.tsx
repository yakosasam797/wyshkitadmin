import { useState, useRef, useEffect } from 'react'
import { Order, OrderStatus } from '../types/order'
import { Eye, Send, RefreshCw, Clock, MessageSquare, CheckCircle, AlertTriangle, FileText, MoreVertical } from 'lucide-react'
import './AdminActionMenu.css'

interface AdminActionMenuProps {
  order: Order
  onAction: (action: string, orderId: string) => void
}

export default function AdminActionMenu({ order, onAction }: AdminActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleAction = (action: string) => {
    onAction(action, order.id)
    setIsOpen(false)
  }

  const getAvailableActions = () => {
    const actions: Array<{ id: string; label: string; icon: any; enabled: boolean; critical?: boolean }> = []

    // View Details - always available
    actions.push({
      id: 'view-details',
      label: 'View Details',
      icon: Eye,
      enabled: true,
    })

    // Remind Vendor - available if vendor delay or customizing/awaiting approval
    if (
      order.status === 'Customizing' ||
      order.status === 'Awaiting Approval' ||
      order.adminFlags.some((f) => f.type === 'vendor_delay')
    ) {
      actions.push({
        id: 'remind-vendor',
        label: 'Remind Vendor',
        icon: Send,
        enabled: true,
      })
    }

    // Reassign Order - available for most statuses except delivered
    if (order.status !== 'Delivered' && order.status !== 'Out for Delivery') {
      actions.push({
        id: 'reassign',
        label: 'Reassign Order',
        icon: RefreshCw,
        enabled: true,
      })
    }

    // Extend Timer - available if awaiting approval or SLA breach
    if (
      order.status === 'Awaiting Approval' ||
      order.adminFlags.some((f) => f.type === 'sla_breach')
    ) {
      actions.push({
        id: 'extend-timer',
        label: 'Extend Timer',
        icon: Clock,
        enabled: true,
      })
    }

    // Mediate Dispute - available if preview dispute
    if (order.adminFlags.some((f) => f.type === 'preview_dispute')) {
      actions.push({
        id: 'mediate-dispute',
        label: 'Mediate Dispute',
        icon: MessageSquare,
        enabled: true,
        critical: true,
      })
    }

    // Override Preview - available if preview dispute or awaiting approval
    if (
      order.status === 'Awaiting Approval' ||
      order.adminFlags.some((f) => f.type === 'preview_dispute')
    ) {
      actions.push({
        id: 'override-preview',
        label: 'Override Preview',
        icon: CheckCircle,
        enabled: true,
        critical: true,
      })
    }

    // Mark Fraud - available if fraud flag
    if (order.adminFlags.some((f) => f.type === 'fraud_flag')) {
      actions.push({
        id: 'mark-fraud',
        label: 'Mark as Fraud',
        icon: AlertTriangle,
        enabled: true,
        critical: true,
      })
    }

    // Add Note - always available
    actions.push({
      id: 'add-note',
      label: 'Add Note',
      icon: FileText,
      enabled: true,
    })

    return actions.filter((a) => a.enabled)
  }

  const actions = getAvailableActions()

  return (
    <div className="admin-action-menu" ref={menuRef}>
      <button
        className="admin-action-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Admin actions"
      >
        <MoreVertical className="icon" />
      </button>

      {isOpen && (
        <div className="admin-action-dropdown">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                className={`admin-action-item ${action.critical ? 'critical' : ''}`}
                onClick={() => handleAction(action.id)}
              >
                <Icon className="admin-action-icon" />
                <span>{action.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}


