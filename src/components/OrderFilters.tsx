import { AdminAlertType } from '../types/order'
import { Search, X } from 'lucide-react'
import './OrderFilters.css'

interface OrderFiltersProps {
  searchQuery: string
  selectedAlertType: AdminAlertType | 'all'
  selectedPriority: string
  selectedVendor: string
  requiresActionOnly: boolean
  vendors: Array<{ id: string; name: string }>
  onSearchChange: (query: string) => void
  onAlertTypeChange: (type: AdminAlertType | 'all') => void
  onPriorityChange: (priority: string) => void
  onVendorChange: (vendorId: string) => void
  onRequiresActionToggle: (enabled: boolean) => void
}

const alertTypeOptions: Array<{ value: AdminAlertType | 'all'; label: string }> = [
  { value: 'all', label: 'All Alerts' },
  { value: 'sla_breach', label: 'SLA Breaches' },
  { value: 'preview_dispute', label: 'Preview Disputes' },
  { value: 'delivery_failure', label: 'Delivery Failures' },
  { value: 'vendor_delay', label: 'Vendor Delays' },
  { value: 'customer_complaint', label: 'Customer Complaints' },
  { value: 'fraud_flag', label: 'Fraud Flags' },
  { value: 'payout_issue', label: 'Payout Issues' },
  { value: 'compliance_issue', label: 'Compliance Issues' },
]

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export default function OrderFilters({
  searchQuery,
  selectedAlertType,
  selectedPriority,
  selectedVendor,
  requiresActionOnly,
  vendors,
  onSearchChange,
  onAlertTypeChange,
  onPriorityChange,
  onVendorChange,
  onRequiresActionToggle,
}: OrderFiltersProps) {
  return (
    <div className="order-filters">
      <div className="filter-group filter-group-search">
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
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X className="icon" />
            </button>
          )}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Alert Type</label>
        <select
          value={selectedAlertType}
          onChange={(e) => onAlertTypeChange(e.target.value as AdminAlertType | 'all')}
          className="filter-select"
        >
          {alertTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Priority</label>
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="filter-select"
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Vendor</label>
        <select
          value={selectedVendor}
          onChange={(e) => onVendorChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Vendors</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group filter-group-toggle">
        <label className="filter-label">Requires Action</label>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={requiresActionOnly}
            onChange={(e) => onRequiresActionToggle(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  )
}
