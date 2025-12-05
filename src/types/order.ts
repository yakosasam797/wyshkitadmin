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

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  productName: string
  productType: ProductType
  vendorName: string
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
}

