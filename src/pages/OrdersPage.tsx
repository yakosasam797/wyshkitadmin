import { useState, useEffect, useMemo } from 'react'
import { Order, OrderStatus, AdminAlertType } from '../types/order'
import { mockOrders } from '../data/mockOrders'
import AlertDashboard from '../components/AlertDashboard'
import RiskRadar from '../components/RiskRadar'
import OrderFilters from '../components/OrderFilters'
import OrderStatusTabs from '../components/OrderStatusTabs'
import OrderDetailsModal from '../components/OrderDetailsModal'
import PriorityTag from '../components/PriorityTag'
import PreviewState from '../components/PreviewState'
import VendorPerformanceBadge from '../components/VendorPerformanceBadge'
import InlineOrderActions from '../components/InlineOrderActions'
import RiskFilterPresets, { RiskFilterPreset } from '../components/RiskFilterPresets'
import { calculateOrderPriority, getPriorityColorScheme } from '../utils/priorityCalculations'
import { Clock, Package, Truck, CheckCircle, Palette, Store } from 'lucide-react'
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
  const [activeRiskFilter, setActiveRiskFilter] = useState<'preview_sla' | 'fresh_perishables' | 'delivery_issues' | null>(null)
  const [activeRiskPreset, setActiveRiskPreset] = useState<RiskFilterPreset>(null)

  // Calculate priority using new priority calculation system
  const ordersWithPriority = useMemo(() => {
    return orders.map((order) => {
      const priorityInfo = calculateOrderPriority(order)
      return { ...order, priorityScore: priorityInfo.score, priorityInfo }
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
      'Cancelled': 0,
    }

    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1
    })

    return counts
  }, [orders])

  // Calculate risk filter preset counts
  const riskFilterCounts = useMemo(() => {
    const now = new Date()
    let critical = 0
    let deliveryFailures = 0
    let awaitingPreview = 0
    let freshOnly = 0

    ordersWithPriority.forEach((order) => {
      const priorityInfo = (order as any).priorityInfo || calculateOrderPriority(order)
      
      // Critical (priority level critical)
      if (priorityInfo.level === 'critical') {
        critical++
      }

      // Delivery Failures
      if (
        order.adminFlags.some((f) => f.type === 'delivery_failure' && !f.resolvedAt) ||
        (order.rtoStatus && order.rtoStatus !== 'none')
      ) {
        deliveryFailures++
      } else if (order.status === 'Out for Delivery' && order.outForDeliverySince) {
        const since = new Date(order.outForDeliverySince)
        const diffHours = (now.getTime() - since.getTime()) / (1000 * 60 * 60)
        if (diffHours > 24) {
          deliveryFailures++
        }
      }

      // Awaiting Preview
      if (order.status === 'Awaiting Approval' && order.previewSlaDeadline) {
        awaitingPreview++
      }

      // Fresh Only
      if (order.productType === 'Fresh Perishable' && order.status !== 'Delivered') {
        freshOnly++
      }
    })

    return { critical, deliveryFailures, awaitingPreview, freshOnly }
  }, [ordersWithPriority])

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

    // Risk filter presets
    if (activeRiskPreset) {
      const now = new Date()
      if (activeRiskPreset === 'critical') {
        filtered = filtered.filter((order) => {
          const priorityInfo = (order as any).priorityInfo || calculateOrderPriority(order)
          return priorityInfo.level === 'critical'
        })
      } else if (activeRiskPreset === 'delivery_failures') {
        filtered = filtered.filter((order) => {
          return (
            order.adminFlags.some((f) => f.type === 'delivery_failure' && !f.resolvedAt) ||
            (order.rtoStatus && order.rtoStatus !== 'none') ||
            (order.status === 'Out for Delivery' && order.outForDeliverySince && 
             (now.getTime() - new Date(order.outForDeliverySince).getTime()) / (1000 * 60 * 60) > 24)
          )
        })
      } else if (activeRiskPreset === 'awaiting_preview') {
        filtered = filtered.filter((order) => order.status === 'Awaiting Approval' && order.previewSlaDeadline)
      } else if (activeRiskPreset === 'fresh_only') {
        filtered = filtered.filter((order) => order.productType === 'Fresh Perishable' && order.status !== 'Delivered')
      }
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
  }, [ordersWithPriority, selectedStatus, selectedAlertType, selectedPriority, selectedVendor, requiresActionOnly, activeRiskPreset, searchQuery])

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
      'Cancelled': { icon: Package, color: '#6b7280', bgColor: '#f3f4f6' },
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

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <RiskRadar
          orders={orders}
          onFilter={setActiveRiskFilter}
          activeFilter={activeRiskFilter}
        />
        <div style={{ flex: 1 }}>
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
        </div>
      </div>

      <div className="orders-content">
        <RiskFilterPresets
          activePreset={activeRiskPreset}
          onPresetChange={setActiveRiskPreset}
          counts={riskFilterCounts}
        />

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
                <th>ALERT LEVEL</th>
                <th>PRODUCT + VENDOR</th>
                <th>CUSTOMER</th>
                <th>SLA TIMER</th>
                <th>STATUS</th>
                <th>PREVIEW STATE</th>
                <th>QUICK ACTIONS</th>
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
                  const priorityInfo = (order as any).priorityInfo || calculateOrderPriority(order)
                  const priorityColors = getPriorityColorScheme(priorityInfo.level)
                  const isFresh = order.productType === 'Fresh Perishable'

                  return (
                    <tr
                      key={order.id}
                      className={`order-row order-priority-${priorityInfo.level} ${order.requiresAdminAction ? 'requires-action' : ''}`}
                      style={{
                        backgroundColor: priorityColors.bgColor,
                        borderLeft: `4px solid ${priorityColors.borderColor}`,
                      }}
                    >
                      <td className="alert-level-cell">
                        <div className="priority-tags-container">
                          {priorityInfo.tags.slice(0, 3).map((tag: string, idx: number) => (
                            <PriorityTag key={idx} tag={tag} />
                          ))}
                          {priorityInfo.tags.length > 3 && (
                            <span className="more-tags">+{priorityInfo.tags.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="product-vendor-cell">
                        <div className="product-vendor-info">
                          <div className="product-info-row">
                            <img
                              src={order.productImageUrl || 'https://via.placeholder.com/60'}
                              alt={order.productName}
                              className="product-image"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = 'https://via.placeholder.com/60'
                              }}
                            />
                            <div className="product-details">
                              <div className="product-name-row">
                                <span className="product-name">{order.productName}</span>
                                {isFresh && <PriorityTag tag="FRESH" />}
                              </div>
                              <div className="vendor-info-row">
                                <Store className="vendor-icon" />
                                <span className="vendor-name">{order.vendorName}</span>
                                {order.vendorMetrics && (
                                  <VendorPerformanceBadge order={order} />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="customer-cell">
                        <div className="customer-info">
                          <div className="customer-name">{order.customerName}</div>
                          {order.customerPhone && (
                            <div className="customer-phone">{order.customerPhone}</div>
                          )}
                        </div>
                      </td>
                      <td className="sla-timer-cell">
                        {deadline ? (
                          <div className={`sla-timer ${deadline.isOverdue ? 'overdue' : ''}`}>
                            <Clock className="sla-timer-icon" />
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
                      <td className="preview-state-cell">
                        {order.previewEnabled ? (
                          <PreviewState order={order} />
                        ) : (
                          <span className="no-preview">No Preview</span>
                        )}
                      </td>
                      <td className="quick-actions-cell">
                        <InlineOrderActions order={order} onAction={handleAdminAction} />
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
