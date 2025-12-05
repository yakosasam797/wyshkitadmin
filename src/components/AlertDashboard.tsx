import { Order, AdminAlertType } from '../types/order'
import { AlertCircle, Clock, AlertTriangle, Truck, User, DollarSign } from 'lucide-react'
import './AlertDashboard.css'

type FilterAction = AdminAlertType | 'all' | 'critical_priority' | 'requires_action'

interface AlertDashboardProps {
  orders: Order[]
  onAlertFilter?: (action: FilterAction) => void
}

export default function AlertDashboard({ orders, onAlertFilter }: AlertDashboardProps) {
  const criticalAlerts = orders.filter(
    (o) => o.adminFlags.some((flag) => flag.priority === 'critical' && !flag.resolvedAt)
  ).length

  const slaBreaches = orders.filter(
    (o) => o.adminFlags.some((flag) => flag.type === 'sla_breach' && !flag.resolvedAt)
  ).length

  const previewDisputes = orders.filter(
    (o) => o.adminFlags.some((flag) => flag.type === 'preview_dispute' && !flag.resolvedAt)
  ).length

  const deliveryFailures = orders.filter(
    (o) => o.adminFlags.some((flag) => flag.type === 'delivery_failure' && !flag.resolvedAt)
  ).length

  const vendorDelays = orders.filter(
    (o) => o.adminFlags.some((flag) => flag.type === 'vendor_delay' && !flag.resolvedAt)
  ).length

  const requiresAction = orders.filter((o) => o.requiresAdminAction).length

  const alertCards = [
    {
      label: 'Critical Alerts',
      count: criticalAlerts,
      icon: AlertCircle,
      color: '#dc2626',
      bgColor: '#fee2e2',
      filterAction: 'critical_priority' as FilterAction,
    },
    {
      label: 'SLA Breaches',
      count: slaBreaches,
      icon: Clock,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      filterAction: 'sla_breach' as FilterAction,
    },
    {
      label: 'Preview Disputes',
      count: previewDisputes,
      icon: AlertTriangle,
      color: '#dc2626',
      bgColor: '#fee2e2',
      filterAction: 'preview_dispute' as FilterAction,
    },
    {
      label: 'Delivery Failures',
      count: deliveryFailures,
      icon: Truck,
      color: '#dc2626',
      bgColor: '#fee2e2',
      filterAction: 'delivery_failure' as FilterAction,
    },
    {
      label: 'Vendor Delays',
      count: vendorDelays,
      icon: User,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      filterAction: 'vendor_delay' as FilterAction,
    },
    {
      label: 'Requires Action',
      count: requiresAction,
      icon: AlertCircle,
      color: '#dc2626',
      bgColor: '#fee2e2',
      filterAction: 'requires_action' as FilterAction,
    },
  ]

  return (
    <div className="alert-dashboard">
      {alertCards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className={`alert-card ${card.count > 0 ? 'has-alerts' : ''}`}
            onClick={() => onAlertFilter && onAlertFilter(card.filterAction)}
            style={{ cursor: onAlertFilter ? 'pointer' : 'default' }}
          >
            <div className="alert-card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <Icon className="icon" />
            </div>
            <div className="alert-card-content">
              <div className="alert-card-label">{card.label}</div>
              <div className="alert-card-count" style={{ color: card.color }}>
                {card.count}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

