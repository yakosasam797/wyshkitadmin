export type OrderStatus = 
  | 'Order Placed'
  | 'Customizing'
  | 'Awaiting Approval'
  | 'Preparing'
  | 'Packed'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'

export type ProductType = 
  | 'Regular'
  | 'Packaged Perishable'
  | 'Fresh Perishable'

export type AdminAlertType = 
  | 'sla_breach'
  | 'preview_dispute'
  | 'delivery_failure'
  | 'vendor_delay'
  | 'customer_complaint'
  | 'fraud_flag'
  | 'payout_issue'
  | 'compliance_issue'

export type AlertPriority = 'critical' | 'high' | 'medium' | 'low'

export interface AdminAlert {
  type: AdminAlertType
  priority: AlertPriority
  message: string
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
}

export interface AdminIntervention {
  action: string
  performedBy: string
  performedAt: string
  notes?: string
  previousStatus?: OrderStatus
  newStatus?: OrderStatus
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  productName: string
  productType: ProductType
  vendorName: string
  vendorId: string
  status: OrderStatus
  amount: number
  createdAt: string
  updatedAt: string
  previewEnabled: boolean
  previewUrl?: string
  previewUploadedAt?: string
  previewApprovedAt?: string
  previewDeclinedAt?: string
  previewSlaDeadline?: string
  packageWeight?: number
  packageDimensions?: string
  trackingNumber?: string
  deliveryAddress: string
  notes?: string
  // Admin control fields
  adminFlags: AdminAlert[]
  vendorDelayMinutes?: number
  slaBreachAt?: string
  disputeType?: 'preview_rejection' | 'quality_issue' | 'delivery_issue' | 'other'
  requiresAdminAction: boolean
  adminNotes?: string
  lastAdminAction?: AdminIntervention
  interventionHistory: AdminIntervention[]
  priorityScore?: number // Calculated field for sorting
  productImageUrl?: string
}

