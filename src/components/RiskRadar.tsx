import { Order } from '../types/order'
import { Clock, AlertCircle, Truck, AlertTriangle } from 'lucide-react'
import './RiskRadar.css'

type RiskFilter = 'preview_sla' | 'fresh_perishables' | 'delivery_issues' | null

interface RiskRadarProps {
  orders: Order[]
  onFilter?: (filter: RiskFilter) => void
  activeFilter?: RiskFilter
}

export default function RiskRadar({ orders, onFilter, activeFilter }: RiskRadarProps) {
  const now = new Date()

  // Card 1: Preview SLA
  const previewSlaOrders = orders.filter((order) => {
    if (!order.previewSlaDeadline || order.status !== 'Awaiting Approval') return false
    const deadline = new Date(order.previewSlaDeadline)
    const diffMs = deadline.getTime() - now.getTime()
    const diffMins = diffMs / (1000 * 60)
    return diffMins > 0 && diffMins <= 60
  })

  const previewSlaBreached = orders.filter((order) => {
    if (!order.previewSlaDeadline || order.status !== 'Awaiting Approval') return false
    const deadline = new Date(order.previewSlaDeadline)
    return deadline.getTime() < now.getTime()
  })

  // Card 2: Fresh Perishables Risk
  const freshOrdersAtRisk = orders.filter((order) => {
    if (order.productType !== 'Fresh Perishable' || !order.packingDeadline) return false
    const deadline = new Date(order.packingDeadline)
    const diffMs = deadline.getTime() - now.getTime()
    const diffMins = diffMs / (1000 * 60)
    return diffMins > 0 && diffMins <= 45
  })

  const freshOrdersBreached = orders.filter((order) => {
    if (order.productType !== 'Fresh Perishable' || !order.packingDeadline) return false
    const deadline = new Date(order.packingDeadline)
    return deadline.getTime() < now.getTime() && order.status !== 'Delivered'
  })

  // Card 3: Delivery Issues
  const stuckDeliveryOrders = orders.filter((order) => {
    if (order.status !== 'Out for Delivery' || !order.outForDeliverySince) return false
    const since = new Date(order.outForDeliverySince)
    const diffMs = now.getTime() - since.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    return diffHours > 24
  })

  const rtoOrders = orders.filter((order) => {
    return order.rtoStatus && order.rtoStatus !== 'none'
  })

  const handleCardClick = (filter: RiskFilter) => {
    if (onFilter) {
      onFilter(filter === activeFilter ? null : filter)
    }
  }

  return (
    <div className="risk-radar">
      <h3 className="risk-radar-title">SLA Risk Radar</h3>
      
      {/* Card 1: Preview SLA */}
      <div
        className={`risk-card ${activeFilter === 'preview_sla' ? 'active' : ''} ${previewSlaBreached.length > 0 ? 'critical' : ''}`}
        onClick={() => handleCardClick('preview_sla')}
      >
        <div className="risk-card-header">
          <Clock className="risk-card-icon" />
          <span className="risk-card-label">Preview SLA</span>
        </div>
        <div className="risk-card-content">
          {previewSlaOrders.length > 0 && (
            <div className="risk-stat">
              <AlertTriangle className="risk-stat-icon warning" />
              <span className="risk-stat-text">
                {previewSlaOrders.length} orders need preview in &lt; 60 mins
              </span>
            </div>
          )}
          {previewSlaBreached.length > 0 && (
            <div className="risk-stat">
              <AlertCircle className="risk-stat-icon critical" />
              <span className="risk-stat-text critical">
                {previewSlaBreached.length} orders SLA BREACHED (overdue)
              </span>
            </div>
          )}
          {previewSlaOrders.length === 0 && previewSlaBreached.length === 0 && (
            <div className="risk-stat">
              <span className="risk-stat-text safe">All clear</span>
            </div>
          )}
        </div>
      </div>

      {/* Card 2: Fresh Perishables Risk */}
      <div
        className={`risk-card ${activeFilter === 'fresh_perishables' ? 'active' : ''} ${freshOrdersBreached.length > 0 ? 'critical' : ''}`}
        onClick={() => handleCardClick('fresh_perishables')}
      >
        <div className="risk-card-header">
          <AlertCircle className="risk-card-icon" />
          <span className="risk-card-label">Fresh Perishables Risk</span>
        </div>
        <div className="risk-card-content">
          {freshOrdersAtRisk.length > 0 && (
            <div className="risk-stat">
              <AlertTriangle className="risk-stat-icon warning" />
              <span className="risk-stat-text">
                {freshOrdersAtRisk.length} orders: packing deadline in &lt; 45 mins
              </span>
            </div>
          )}
          {freshOrdersBreached.length > 0 && (
            <div className="risk-stat">
              <AlertCircle className="risk-stat-icon critical" />
              <span className="risk-stat-text critical">
                {freshOrdersBreached.length} orders breach risk — RUNWAY LOW
              </span>
            </div>
          )}
          {freshOrdersAtRisk.length === 0 && freshOrdersBreached.length === 0 && (
            <div className="risk-stat">
              <span className="risk-stat-text safe">All clear</span>
            </div>
          )}
        </div>
      </div>

      {/* Card 3: Delivery Issues */}
      <div
        className={`risk-card ${activeFilter === 'delivery_issues' ? 'active' : ''} ${rtoOrders.length > 0 ? 'critical' : ''}`}
        onClick={() => handleCardClick('delivery_issues')}
      >
        <div className="risk-card-header">
          <Truck className="risk-card-icon" />
          <span className="risk-card-label">Delivery Issues</span>
        </div>
        <div className="risk-card-content">
          {stuckDeliveryOrders.length > 0 && (
            <div className="risk-stat">
              <AlertTriangle className="risk-stat-icon warning" />
              <span className="risk-stat-text">
                {stuckDeliveryOrders.length} stuck Out for Delivery &gt; 24 hrs
              </span>
            </div>
          )}
          {rtoOrders.length > 0 && (
            <div className="risk-stat">
              <AlertCircle className="risk-stat-icon critical" />
              <span className="risk-stat-text critical">
                {rtoOrders.length} in RTO initiated
              </span>
            </div>
          )}
          {stuckDeliveryOrders.length === 0 && rtoOrders.length === 0 && (
            <div className="risk-stat">
              <span className="risk-stat-text safe">All clear</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

