import { useState, useEffect } from 'react'
import { Order, OrderStatus } from '../types/order'
import { mockOrders } from '../data/mockOrders'
import OrderCard from '../components/OrderCard'
import OrderFilters from '../components/OrderFilters'
import './OrdersPage.css'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'All'>('All')
  const [selectedProductType, setSelectedProductType] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) => {
        // Simulate status updates for demonstration
        return prevOrders.map((order) => {
          // Randomly update some orders to simulate live feed
          if (Math.random() > 0.95 && order.status !== 'Delivered') {
            const statuses: OrderStatus[] = [
              'Order Placed',
              'Customizing',
              'Awaiting Approval',
              'Preparing',
              'Packed',
              'Ready for Pickup',
              'Out for Delivery',
              'Delivered',
            ]
            const currentIndex = statuses.indexOf(order.status)
            if (currentIndex < statuses.length - 1) {
              return {
                ...order,
                status: statuses[currentIndex + 1],
                updatedAt: new Date().toISOString(),
              }
            }
          }
          return order
        })
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...orders]

    if (selectedStatus !== 'All') {
      filtered = filtered.filter((order) => order.status === selectedStatus)
    }

    if (selectedProductType !== 'All') {
      filtered = filtered.filter((order) => order.productType === selectedProductType)
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

    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    setFilteredOrders(filtered)
  }, [orders, selectedStatus, selectedProductType, searchQuery])

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1 className="page-title">Order Monitoring</h1>
          <p className="page-subtitle">Real-time order tracking and management</p>
        </div>
      </div>

      <div className="orders-content">
        <OrderFilters
          selectedStatus={selectedStatus}
          selectedProductType={selectedProductType}
          searchQuery={searchQuery}
          onStatusChange={setSelectedStatus}
          onProductTypeChange={setSelectedProductType}
          onSearchChange={setSearchQuery}
        />

        <div className="live-order-feed">
          <div className="feed-header">
            <h2 className="feed-title">Live Order Feed</h2>
            <div className="feed-stats">
              <span className="stat-item">
                Total: <strong>{filteredOrders.length}</strong>
              </span>
              <span className="stat-item">
                Active: <strong>{filteredOrders.filter((o) => o.status !== 'Delivered').length}</strong>
              </span>
            </div>
          </div>

          <div className="orders-list">
            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <p>No orders found matching your filters.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

