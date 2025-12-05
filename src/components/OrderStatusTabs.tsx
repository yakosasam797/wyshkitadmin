import { OrderStatus } from '../types/order'
import { Package, Palette, Clock, Box, Truck, CheckCircle } from 'lucide-react'
import './OrderStatusTabs.css'

interface OrderStatusTabsProps {
  selectedStatus: OrderStatus | 'All'
  onStatusChange: (status: OrderStatus | 'All') => void
  orderCounts: Record<OrderStatus | 'All', number>
}

const statusConfig: Record<OrderStatus | 'All', { label: string; icon: any }> = {
  All: { label: 'All', icon: Package },
  'Order Placed': { label: 'New', icon: Package },
  'Customizing': { label: 'Customizing', icon: Palette },
  'Awaiting Approval': { label: 'Awaiting Approval', icon: Clock },
  'Preparing': { label: 'Preparing', icon: Box },
  'Packed': { label: 'Packed', icon: Box },
  'Ready for Pickup': { label: 'Ready for Pickup', icon: Truck },
  'Out for Delivery': { label: 'Out for Delivery', icon: Truck },
  'Delivered': { label: 'Completed', icon: CheckCircle },
  'Cancelled': { label: 'Cancelled', icon: Package },
}

export default function OrderStatusTabs({ selectedStatus, onStatusChange, orderCounts }: OrderStatusTabsProps) {
  // Show only relevant statuses for admin view
  const visibleStatuses: (OrderStatus | 'All')[] = [
    'All',
    'Order Placed',
    'Customizing',
    'Awaiting Approval',
    'Preparing',
    'Ready for Pickup',
    'Delivered',
  ]

  return (
    <div className="status-tabs">
      {visibleStatuses.map((status) => {
        const config = statusConfig[status]
        const Icon = config.icon
        const isActive = selectedStatus === status
        const count = orderCounts[status] || 0

        return (
          <button
            key={status}
            className={`status-tab ${isActive ? 'active' : ''}`}
            onClick={() => onStatusChange(status)}
          >
            <Icon className="status-tab-icon" />
            <span className="status-tab-label">{config.label}</span>
            {count > 0 && <span className="status-tab-badge">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}


