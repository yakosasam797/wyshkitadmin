import { Order } from '../types/order'
import { Send, CheckCircle, Clock, Truck, DollarSign, RefreshCw, AlertTriangle, Eye } from 'lucide-react'
import './InlineOrderActions.css'

interface InlineOrderActionsProps {
  order: Order
  onAction: (action: string, orderId: string) => void
}

export default function InlineOrderActions({ order, onAction }: InlineOrderActionsProps) {
  const handleAction = (action: string) => {
    onAction(action, order.id)
  }

  const getAvailableActions = () => {
    const actions: Array<{ id: string; label: string; icon: any; variant?: 'primary' | 'danger' | 'default' }> = []

    // View Details - always available
    actions.push({
      id: 'view-details',
      label: 'View',
      icon: Eye,
      variant: 'default',
    })

    // Remind Vendor
    if (
      order.status === 'Customizing' ||
      order.status === 'Awaiting Approval' ||
      order.adminFlags.some((f) => f.type === 'vendor_delay' && !f.resolvedAt)
    ) {
      actions.push({
        id: 'remind-vendor',
        label: 'Remind Vendor',
        icon: Send,
        variant: 'default',
      })
    }

    // Force Approve Preview
    if (order.status === 'Awaiting Approval' && order.previewSlaDeadline) {
      const deadline = new Date(order.previewSlaDeadline)
      if (deadline < new Date() || order.adminFlags.some((f) => f.type === 'sla_breach' && !f.resolvedAt)) {
        actions.push({
          id: 'force-approve-preview',
          label: 'Force Approve',
          icon: CheckCircle,
          variant: 'primary',
        })
      }
    }

    // Extend SLA
    if (
      order.status === 'Awaiting Approval' ||
      order.adminFlags.some((f) => f.type === 'sla_breach' && !f.resolvedAt)
    ) {
      actions.push({
        id: 'extend-sla',
        label: 'Extend SLA',
        icon: Clock,
        variant: 'default',
      })
    }

    // Assign Courier / Change Courier
    if (
      order.status === 'Packed' ||
      order.status === 'Ready for Pickup' ||
      order.adminFlags.some((f) => f.type === 'delivery_failure' && !f.resolvedAt)
    ) {
      actions.push({
        id: 'assign-courier',
        label: order.courier ? 'Change Courier' : 'Assign Courier',
        icon: Truck,
        variant: 'default',
      })
    }

    // Freeze Payout
    if (
      order.payoutState &&
      ['Eligible', 'Scheduled'].includes(order.payoutState) &&
      (order.adminFlags.some((f) => f.type === 'fraud_flag' && !f.resolvedAt) ||
        order.customerComplaint)
    ) {
      actions.push({
        id: 'freeze-payout',
        label: 'Freeze Payout',
        icon: DollarSign,
        variant: 'danger',
      })
    }

    // Request Revision
    if (
      order.status === 'Awaiting Approval' &&
      order.previewVersions &&
      order.previewVersions.length > 0
    ) {
      actions.push({
        id: 'request-revision',
        label: 'Request Revision',
        icon: RefreshCw,
        variant: 'default',
      })
    }

    // Escalate Issue
    if (
      order.adminFlags.some(
        (f) =>
          (f.type === 'preview_dispute' || f.type === 'customer_complaint' || f.type === 'delivery_failure') &&
          !f.resolvedAt
      )
    ) {
      actions.push({
        id: 'escalate-issue',
        label: 'Escalate',
        icon: AlertTriangle,
        variant: 'danger',
      })
    }

    return actions.slice(0, 4) // Show max 4 actions inline
  }

  const actions = getAvailableActions()

  if (actions.length === 0) return null

  return (
    <div className="inline-order-actions">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            className={`inline-action-btn inline-action-${action.variant || 'default'}`}
            onClick={() => handleAction(action.id)}
            title={action.label}
          >
            <Icon className="inline-action-icon" />
            <span className="inline-action-label">{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}

