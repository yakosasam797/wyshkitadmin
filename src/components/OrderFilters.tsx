import { OrderStatus } from '../types/order'
import { Search } from 'lucide-react'
import './OrderFilters.css'

interface OrderFiltersProps {
  selectedStatus: OrderStatus | 'All'
  selectedProductType: string
  searchQuery: string
  onStatusChange: (status: OrderStatus | 'All') => void
  onProductTypeChange: (type: string) => void
  onSearchChange: (query: string) => void
}

const statusOptions: (OrderStatus | 'All')[] = [
  'All',
  'Order Placed',
  'Customizing',
  'Awaiting Approval',
  'Preparing',
  'Packed',
  'Ready for Pickup',
  'Out for Delivery',
  'Delivered',
]

const productTypeOptions = ['All', 'Regular', 'Packaged Perishable', 'Fresh Perishable']

export default function OrderFilters({
  selectedStatus,
  selectedProductType,
  searchQuery,
  onStatusChange,
  onProductTypeChange,
  onSearchChange,
}: OrderFiltersProps) {
  return (
    <div className="order-filters">
      <div className="filter-group">
        <label className="filter-label">Search</label>
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by order number, customer, product, or vendor..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value as OrderStatus | 'All')}
          className="filter-select"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Product Type</label>
        <select
          value={selectedProductType}
          onChange={(e) => onProductTypeChange(e.target.value)}
          className="filter-select"
        >
          {productTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

