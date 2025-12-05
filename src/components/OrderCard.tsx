import { Order, OrderStatus } from '../types/order'
import { Clock, Package, Truck, CheckCircle, AlertCircle, User, Store, MapPin } from 'lucide-react'
import './OrderCard.css'

interface OrderCardProps {
  order: Order
}

const statusConfig: Record<OrderStatus, { color: string; icon: any; bgColor: string }> = {
  'Order Placed': {
    color: '#3b82f6',
    icon: Package,
    bgColor: '#dbeafe',
  },
  'Customizing': {
    color: '#8b5cf6',
    icon: Package,
    bgColor: '#ede9fe',
  },
  'Awaiting Approval': {
    color: '#f59e0b',
    icon: Clock,
    bgColor: '#fef3c7',
  },
  'Preparing': {
    color: '#10b981',
    icon: Package,
    bgColor: '#d1fae5',
  },
  'Packed': {
    color: '#06b6d4',
    icon: Package,
    bgColor: '#cffafe',
  },
  'Ready for Pickup': {
    color: '#6366f1',
    icon: Truck,
    bgColor: '#e0e7ff',
  },
  'Out for Delivery': {
    color: '#ec4899',
    icon: Truck,
    bgColor: '#fce7f3',
  },
  'Delivered': {
    color: '#059669',
    icon: CheckCircle,
    bgColor: '#d1fae5',
  },
  'Cancelled': {
    color: '#6b7280',
    icon: AlertCircle,
    bgColor: '#f3f4f6',
  },
}

export default function OrderCard({ order }: OrderCardProps) {
  const config = statusConfig[order.status]
  const StatusIcon = config.icon

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const isSlaExpired = () => {
    if (!order.previewSlaDeadline) return false
    return new Date(order.previewSlaDeadline) < new Date() && order.status === 'Awaiting Approval'
  }

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-info-main">
          <div className="order-number">{order.orderNumber}</div>
          <div className="order-amount">{formatCurrency(order.amount)}</div>
        </div>
        <div className={`order-status ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
          <StatusIcon className="status-icon" />
          <span>{order.status}</span>
        </div>
      </div>

      <div className="order-card-body">
        <div className="order-details-grid">
          <div className="detail-item">
            <User className="detail-icon" />
            <div>
              <div className="detail-label">Customer</div>
              <div className="detail-value">{order.customerName}</div>
              <div className="detail-subvalue">{order.customerEmail}</div>
            </div>
          </div>

          <div className="detail-item">
            <Package className="detail-icon" />
            <div>
              <div className="detail-label">Product</div>
              <div className="detail-value">{order.productName}</div>
              <div className="detail-subvalue">
                {order.productType}
                {order.previewEnabled && ' • Customizable'}
              </div>
            </div>
          </div>

          <div className="detail-item">
            <Store className="detail-icon" />
            <div>
              <div className="detail-label">Vendor</div>
              <div className="detail-value">{order.vendorName}</div>
            </div>
          </div>

          <div className="detail-item">
            <MapPin className="detail-icon" />
            <div>
              <div className="detail-label">Delivery Address</div>
              <div className="detail-value">{order.deliveryAddress}</div>
            </div>
          </div>
        </div>

        {order.previewEnabled && order.status === 'Awaiting Approval' && (
          <div className={`preview-alert ${isSlaExpired() ? 'expired' : ''}`}>
            <AlertCircle className="alert-icon" />
            <div>
              <div className="alert-title">
                Preview {isSlaExpired() ? 'SLA Expired - Auto-Approved' : 'Pending Approval'}
              </div>
              {order.previewSlaDeadline && (
                <div className="alert-subtitle">
                  Deadline: {new Date(order.previewSlaDeadline).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}

        {order.packageWeight && (
          <div className="package-info">
            <div className="package-item">
              <strong>Weight:</strong> {order.packageWeight} kg
            </div>
            {order.packageDimensions && (
              <div className="package-item">
                <strong>Dimensions:</strong> {order.packageDimensions}
              </div>
            )}
          </div>
        )}

        {order.trackingNumber && (
          <div className="tracking-info">
            <strong>Tracking:</strong> {order.trackingNumber}
          </div>
        )}
      </div>

      <div className="order-card-footer">
        <div className="order-timestamps">
          <div className="timestamp">
            <span className="timestamp-label">Created:</span>
            <span className="timestamp-value">{formatDate(order.createdAt)}</span>
          </div>
          <div className="timestamp">
            <span className="timestamp-label">Updated:</span>
            <span className="timestamp-value">{formatDate(order.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

