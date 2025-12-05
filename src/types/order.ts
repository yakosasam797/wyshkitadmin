export type OrderStatus = 
  | 'Order Placed'
  | 'Customizing'
  | 'Awaiting Approval'
  | 'Preparing'
  | 'Packed'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'

export type ProductType = 
  | 'Regular'
  | 'Packaged Perishable'
  | 'Fresh Perishable'

export type PayoutState = 
  | 'Pending'
  | 'Eligible'
  | 'Scheduled'
  | 'Paid'

export type RTStatus = 
  | 'none'
  | 'initiated'
  | 'in_transit'
  | 'delivered_to_vendor'

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

export interface OrderTimelineEntry {
  status: OrderStatus
  timestamp: string
  performedBy?: string
  notes?: string
}

export interface PreviewVersion {
  version: number
  url: string
  uploadedAt: string
  approvedAt?: string
  declinedAt?: string
  customerFeedback?: string
}

export interface VendorMetrics {
  credibilityScore: number // 0-100
  slaSuccessRate: number // percentage
  previewApprovalRate: number // percentage
  returnsComplaintsRate: number // percentage
  totalOrders: number
}

export interface CourierInfo {
  courierId: string
  courierName: string
  courierPhone: string
  assignedAt?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
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
  previewVersions?: PreviewVersion[]
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
  // New fields for enhanced UI
  payoutState?: PayoutState
  timeline?: OrderTimelineEntry[]
  outForDeliverySince?: string
  rtoStatus?: RTStatus
  rtoInitiatedAt?: string
  packingDeadline?: string
  deliveryWindow?: {
    from: string
    to: string
  }
  requiredDeliveryBy?: string
  vendorMetrics?: VendorMetrics
  courier?: CourierInfo
  customerComplaint?: {
    reason: string
    proofImages?: string[]
    submittedAt: string
    resolved?: boolean
  }
}

