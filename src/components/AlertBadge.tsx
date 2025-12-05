import { AdminAlert, AdminAlertType } from '../types/order'
import { AlertCircle, Clock, AlertTriangle, Truck, User, DollarSign, Shield, FileWarning } from 'lucide-react'
import './AlertBadge.css'

interface AlertBadgeProps {
  alerts: AdminAlert[]
  compact?: boolean
}

const alertConfig: Record<AdminAlertType, { label: string; icon: any; color: string; bgColor: string }> = {
  sla_breach: {
    label: 'SLA Breach',
    icon: Clock,
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  preview_dispute: {
    label: 'Preview Dispute',
    icon: AlertTriangle,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  delivery_failure: {
    label: 'Delivery Failure',
    icon: Truck,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  vendor_delay: {
    label: 'Vendor Delay',
    icon: User,
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  customer_complaint: {
    label: 'Complaint',
    icon: AlertCircle,
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  fraud_flag: {
    label: 'Fraud Flag',
    icon: Shield,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  payout_issue: {
    label: 'Payout Issue',
    icon: DollarSign,
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  compliance_issue: {
    label: 'Compliance',
    icon: FileWarning,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
}

export default function AlertBadge({ alerts, compact = false }: AlertBadgeProps) {
  const activeAlerts = alerts.filter((alert) => !alert.resolvedAt)

  if (activeAlerts.length === 0) {
    return null
  }

  if (compact) {
    // Show only count badge
    const criticalCount = activeAlerts.filter((a) => a.priority === 'critical').length
    const highCount = activeAlerts.filter((a) => a.priority === 'high').length

    if (criticalCount > 0) {
      return (
        <div className="alert-badge-compact critical" title={`${activeAlerts.length} alert(s)`}>
          {activeAlerts.length}
        </div>
      )
    }

    if (highCount > 0) {
      return (
        <div className="alert-badge-compact high" title={`${activeAlerts.length} alert(s)`}>
          {activeAlerts.length}
        </div>
      )
    }

    return (
      <div className="alert-badge-compact" title={`${activeAlerts.length} alert(s)`}>
        {activeAlerts.length}
      </div>
    )
  }

  // Show individual badges
  return (
    <div className="alert-badges">
      {activeAlerts.slice(0, 3).map((alert, index) => {
        const config = alertConfig[alert.type]
        const Icon = config.icon

        return (
          <div
            key={index}
            className={`alert-badge ${alert.priority}`}
            style={{
              backgroundColor: config.bgColor,
              color: config.color,
            }}
            title={alert.message}
          >
            <Icon className="alert-badge-icon" />
            <span className="alert-badge-label">{config.label}</span>
          </div>
        )
      })}
      {activeAlerts.length > 3 && (
        <div className="alert-badge-more" title={`${activeAlerts.length - 3} more alert(s)`}>
          +{activeAlerts.length - 3}
        </div>
      )}
    </div>
  )
}


