import { useState, useEffect, useMemo } from 'react'
import { Order, OrderStatus, AdminAlertType } from '../types/order'
import { mockOrders } from '../data/mockOrders'
import AlertDashboard from '../components/AlertDashboard'
import OrderFilters from '../components/OrderFilters'
import OrderStatusTabs from '../components/OrderStatusTabs'
import AlertBadge from '../components/AlertBadge'
import AdminActionMenu from '../components/AdminActionMenu'
import OrderDetailsModal from '../components/OrderDetailsModal'
import { Clock, Package, Truck, CheckCircle, Palette } from 'lucide-react'
import './OrdersPage.css'

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'All'>('All')
  const [selectedAlertType, setSelectedAlertType] = useState<AdminAlertType | 'all'>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [selectedVendor, setSelectedVendor] = useState<string>('all')
  const [requiresActionOnly, setRequiresActionOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Calculate priority scores for orders
  const ordersWithPriority = useMemo(() => {
    return orders.map((order) => {
      let score = 0
      const criticalAlerts = order.adminFlags.filter((f) => f.priority === 'critical' && !f.resolvedAt).length
      const highAlerts = order.adminFlags.filter((f) => f.priority === 'high' && !f.resolvedAt).length
      const mediumAlerts = order.adminFlags.filter((f) => f.priority === 'medium' && !f.resolvedAt).length

      score += criticalAlerts * 1000
      score += highAlerts * 100
      score += mediumAlerts * 10

      if (order.requiresAdminAction) {
        score += 50
      }

      // Fresh perishables get higher priority
      if (order.productType === 'Fresh Perishable' && order.status !== 'Delivered') {
        score += 20
      }

      return { ...order, priorityScore: score }
    })
  }, [orders])

  // Calculate order counts by status
  const orderCounts = useMemo(() => {
    const counts: Record<OrderStatus | 'All', number> = {
      All: orders.length,
      'Order Placed': 0,
      'Customizing': 0,
      'Awaiting Approval': 0,
      'Preparing': 0,
      'Packed': 0,
      'Ready for Pickup': 0,
      'Out for Delivery': 0,
      'Delivered': 0,
    }

    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1
    })

    return counts
  }, [orders])

  // Apply filters
  useEffect(() => {
    let filtered = [...ordersWithPriority]

    if (selectedStatus !== 'All') {
      filtered = filtered.filter((order) => order.status === selectedStatus)
    }

    if (selectedAlertType !== 'all') {
      filtered = filtered.filter((order) =>
        order.adminFlags.some((flag) => flag.type === selectedAlertType && !flag.resolvedAt)
      )
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter((order) =>
        order.adminFlags.some((flag) => flag.priority === selectedPriority && !flag.resolvedAt)
      )
    }

    if (selectedVendor !== 'all') {
      filtered = filtered.filter((order) => order.vendorId === selectedVendor)
    }

    if (requiresActionOnly) {
      filtered = filtered.filter((order) => order.requiresAdminAction)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.productName.toLowerCase().includes(query) ||
          order.vendorName.toLowerCase().includes(query)
      )
    }

    // Sort by priority score (highest first), then by updated time
    filtered.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return (b.priorityScore || 0) - (a.priorityScore || 0)
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

    setFilteredOrders(filtered)
  }, [ordersWithPriority, selectedStatus, selectedAlertType, selectedPriority, selectedVendor, requiresActionOnly, searchQuery])

  const handleAdminAction = (action: string, orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    if (action === 'view-details') {
      setSelectedOrder(order)
    } else {
      console.log('Admin action:', action, 'on order:', orderId)
      // TODO: Implement actual admin actions
    }
  }

  const handleCloseModal = () => {
    setSelectedOrder(null)
  }

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffMs = deadlineDate.getTime() - now.getTime()

    if (diffMs < 0) {
      const hoursPast = Math.floor(Math.abs(diffMs) / 3600000)
      const minsPast = Math.floor((Math.abs(diffMs) % 3600000) / 60000)
      return { text: `${hoursPast}h ${minsPast}m overdue`, isOverdue: true }
    }

    const hours = Math.floor(diffMs / 3600000)
    const mins = Math.floor((diffMs % 3600000) / 60000)
    return { text: `${hours}h ${mins}m remaining`, isOverdue: false }
  }

  const getStatusConfig = (status: OrderStatus) => {
    const configs: Record<OrderStatus, { icon: any; color: string; bgColor: string }> = {
      'Order Placed': { icon: Package, color: '#3b82f6', bgColor: '#dbeafe' },
      'Customizing': { icon: Palette, color: '#8b5cf6', bgColor: '#ede9fe' },
      'Awaiting Approval': { icon: Clock, color: '#f59e0b', bgColor: '#fef3c7' },
      'Preparing': { icon: Package, color: '#10b981', bgColor: '#d1fae5' },
      'Packed': { icon: Package, color: '#06b6d4', bgColor: '#cffafe' },
      'Ready for Pickup': { icon: Truck, color: '#6366f1', bgColor: '#e0e7ff' },
      'Out for Delivery': { icon: Truck, color: '#ec4899', bgColor: '#fce7f3' },
      'Delivered': { icon: CheckCircle, color: '#059669', bgColor: '#d1fae5' },
    }
    return configs[status]
  }

  const uniqueVendors = useMemo(() => {
    const vendorMap = new Map<string, { id: string; name: string }>()
    orders.forEach((order) => {
      if (!vendorMap.has(order.vendorId)) {
        vendorMap.set(order.vendorId, { id: order.vendorId, name: order.vendorName })
      }
    })
    return Array.from(vendorMap.values())
  }, [orders])

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">Manage orders and approve customization proofs</p>
        </div>
      </div>

      <AlertDashboard
        orders={orders}
        onAlertFilter={(action) => {
          if (action === 'critical_priority') {
            setSelectedPriority('critical')
            setSelectedAlertType('all')
            setRequiresActionOnly(false)
          } else if (action === 'requires_action') {
            setRequiresActionOnly(true)
            setSelectedAlertType('all')
            setSelectedPriority('all')
          } else {
            setSelectedAlertType(action)
            setSelectedPriority('all')
            setRequiresActionOnly(false)
          }
        }}
      />

      <div className="orders-content">
        <OrderFilters
          searchQuery={searchQuery}
          selectedAlertType={selectedAlertType}
          selectedPriority={selectedPriority}
          selectedVendor={selectedVendor}
          requiresActionOnly={requiresActionOnly}
          vendors={uniqueVendors}
          onSearchChange={setSearchQuery}
          onAlertTypeChange={setSelectedAlertType}
          onPriorityChange={setSelectedPriority}
          onVendorChange={setSelectedVendor}
          onRequiresActionToggle={setRequiresActionOnly}
        />

        <OrderStatusTabs
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          orderCounts={orderCounts}
        />

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>PRODUCT</th>
                <th>CUSTOMER NAME</th>
                <th>DEADLINE</th>
                <th>STATUS</th>
                <th>ALERTS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    No orders found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status)
                  const StatusIcon = statusConfig.icon
                  const deadline = formatDeadline(order.previewSlaDeadline)
                  const hasAlerts = order.adminFlags.some((f) => !f.resolvedAt)

                  return (
                    <tr
                      key={order.id}
                      className={`order-row ${order.requiresAdminAction ? 'requires-action' : ''} ${hasAlerts ? 'has-alerts' : ''}`}
                    >
                      <td className="order-id">{order.orderNumber}</td>
                      <td className="product-cell">
                        <div className="product-info">
                          <img
                            src={order.productImageUrl || 'https://via.placeholder.com/60'}
                            alt={order.productName}
                            className="product-image"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = 'https://via.placeholder.com/60'
                            }}
                          />
                          <span className="product-name">{order.productName}</span>
                        </div>
                      </td>
                      <td className="customer-name">{order.customerName}</td>
                      <td className="deadline-cell">
                        {deadline ? (
                          <div className={`deadline ${deadline.isOverdue ? 'overdue' : ''}`}>
                            <Clock className="deadline-icon" />
                            <span>{deadline.text}</span>
                          </div>
                        ) : (
                          <span className="no-deadline">—</span>
                        )}
                      </td>
                      <td className="status-cell">
                        <div
                          className="status-badge"
                          style={{
                            backgroundColor: statusConfig.bgColor,
                            color: statusConfig.color,
                          }}
                        >
                          <StatusIcon className="status-icon" />
                          <span>{order.status}</span>
                        </div>
                      </td>
                      <td className="alerts-cell">
                        <AlertBadge alerts={order.adminFlags} compact />
                      </td>
                      <td className="action-cell">
                        <AdminActionMenu order={order} onAction={handleAdminAction} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onAction={handleAdminAction}
        />
      )}
    </div>
  )
}
