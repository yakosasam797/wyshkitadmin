import { Order, OrderStatus } from '../types/order'
import { X, Clock, User, Package, Store, MapPin, CheckCircle, XCircle, Send, RefreshCw, FileText, MessageSquare } from 'lucide-react'
import AlertBadge from './AlertBadge'
import './OrderDetailsModal.css'

interface OrderDetailsModalProps {
  order: Order | null
  onClose: () => void
  onAction: (action: string, orderId: string) => void
}

export default function OrderDetailsModal({ order, onClose, onAction }: OrderDetailsModalProps) {
  if (!order) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
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

  const deadline = formatDeadline(order.previewSlaDeadline)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Order Details</h2>
            <p className="modal-subtitle">{order.orderNumber}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X className="icon" />
          </button>
        </div>

        <div className="modal-body">
          {/* Alerts Section */}
          {order.adminFlags.length > 0 && (
            <div className="modal-section">
              <h3 className="section-title">Alerts</h3>
              <AlertBadge alerts={order.adminFlags} />
              <div className="alerts-list">
                {order.adminFlags
                  .filter((f) => !f.resolvedAt)
                  .map((alert, index) => (
                    <div key={index} className={`alert-item ${alert.priority}`}>
                      <div className="alert-item-header">
                        <span className="alert-item-type">{alert.type.replace('_', ' ')}</span>
                        <span className={`alert-item-priority ${alert.priority}`}>{alert.priority}</span>
                      </div>
                      <p className="alert-item-message">{alert.message}</p>
                      <span className="alert-item-time">{formatDate(alert.createdAt)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Order Information */}
          <div className="modal-section">
            <h3 className="section-title">Order Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Order Amount</span>
                <span className="info-value">{formatCurrency(order.amount)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">{order.status}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Product Type</span>
                <span className="info-value">{order.productType}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Created</span>
                <span className="info-value">{formatDate(order.createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated</span>
                <span className="info-value">{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="modal-section">
            <h3 className="section-title">Customer</h3>
            <div className="detail-card">
              <User className="detail-icon" />
              <div>
                <div className="detail-name">{order.customerName}</div>
                <div className="detail-email">{order.customerEmail}</div>
              </div>
            </div>
            <div className="detail-card">
              <MapPin className="detail-icon" />
              <div className="detail-address">{order.deliveryAddress}</div>
            </div>
          </div>

          {/* Product Information */}
          <div className="modal-section">
            <h3 className="section-title">Product</h3>
            <div className="product-detail">
              <img
                src={order.productImageUrl || 'https://via.placeholder.com/100'}
                alt={order.productName}
                className="product-detail-image"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = 'https://via.placeholder.com/100'
                }}
              />
              <div>
                <div className="product-detail-name">{order.productName}</div>
                <div className="product-detail-type">
                  {order.productType}
                  {order.previewEnabled && ' • Customizable'}
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Information */}
          <div className="modal-section">
            <h3 className="section-title">Vendor</h3>
            <div className="detail-card">
              <Store className="detail-icon" />
              <div>
                <div className="detail-name">{order.vendorName}</div>
                {order.vendorDelayMinutes && (
                  <div className="detail-delay">
                    Delay: {Math.floor(order.vendorDelayMinutes / 60)}h {order.vendorDelayMinutes % 60}m
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Management */}
          {order.previewEnabled && (
            <div className="modal-section">
              <h3 className="section-title">Preview Management</h3>
              {order.previewUrl ? (
                <div className="preview-section">
                  <img src={order.previewUrl} alt="Preview" className="preview-image" />
                  <div className="preview-actions">
                    {order.status === 'Awaiting Approval' && (
                      <>
                        <button
                          className="action-button approve"
                          onClick={() => onAction('approve-preview', order.id)}
                        >
                          <CheckCircle className="icon" />
                          Approve Preview
                        </button>
                        <button
                          className="action-button reject"
                          onClick={() => onAction('reject-preview', order.id)}
                        >
                          <XCircle className="icon" />
                          Reject Preview
                        </button>
                      </>
                    )}
                  </div>
                  {deadline && (
                    <div className={`deadline-info ${deadline.isOverdue ? 'overdue' : ''}`}>
                      <Clock className="icon" />
                      <span>{deadline.text}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="preview-pending">Preview not yet uploaded by vendor</div>
              )}
            </div>
          )}

          {/* Admin Actions */}
          <div className="modal-section">
            <h3 className="section-title">Admin Actions</h3>
            <div className="admin-actions-grid">
              {(order.status === 'Customizing' || order.status === 'Awaiting Approval') && (
                <button
                  className="admin-action-btn"
                  onClick={() => onAction('remind-vendor', order.id)}
                >
                  <Send className="icon" />
                  Remind Vendor
                </button>
              )}
              {order.status !== 'Delivered' && order.status !== 'Out for Delivery' && (
                <button
                  className="admin-action-btn"
                  onClick={() => onAction('reassign', order.id)}
                >
                  <RefreshCw className="icon" />
                  Reassign Order
                </button>
              )}
              {(order.status === 'Awaiting Approval' || order.adminFlags.some((f) => f.type === 'sla_breach')) && (
                <button
                  className="admin-action-btn"
                  onClick={() => onAction('extend-timer', order.id)}
                >
                  <Clock className="icon" />
                  Extend Timer
                </button>
              )}
              {order.adminFlags.some((f) => f.type === 'preview_dispute') && (
                <button
                  className="admin-action-btn critical"
                  onClick={() => onAction('mediate-dispute', order.id)}
                >
                  <MessageSquare className="icon" />
                  Mediate Dispute
                </button>
              )}
              {(order.status === 'Awaiting Approval' || order.adminFlags.some((f) => f.type === 'preview_dispute')) && (
                <button
                  className="admin-action-btn critical"
                  onClick={() => onAction('override-preview', order.id)}
                >
                  <CheckCircle className="icon" />
                  Override Preview
                </button>
              )}
              <button
                className="admin-action-btn"
                onClick={() => onAction('add-note', order.id)}
              >
                <FileText className="icon" />
                Add Note
              </button>
            </div>
          </div>

          {/* Admin Notes */}
          {order.adminNotes && (
            <div className="modal-section">
              <h3 className="section-title">Admin Notes</h3>
              <div className="admin-notes">{order.adminNotes}</div>
            </div>
          )}

          {/* Intervention History */}
          {order.interventionHistory.length > 0 && (
            <div className="modal-section">
              <h3 className="section-title">Intervention History</h3>
              <div className="intervention-timeline">
                {order.interventionHistory.map((intervention, index) => (
                  <div key={index} className="intervention-item">
                    <div className="intervention-header">
                      <span className="intervention-action">{intervention.action}</span>
                      <span className="intervention-time">{formatDate(intervention.performedAt)}</span>
                    </div>
                    <div className="intervention-by">By: {intervention.performedBy}</div>
                    {intervention.notes && (
                      <div className="intervention-notes">{intervention.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Information */}
          {order.packageWeight && (
            <div className="modal-section">
              <h3 className="section-title">Package Information</h3>
              <div className="package-info">
                <div className="package-item">
                  <strong>Weight:</strong> {order.packageWeight} kg
                </div>
                {order.packageDimensions && (
                  <div className="package-item">
                    <strong>Dimensions:</strong> {order.packageDimensions}
                  </div>
                )}
                {order.trackingNumber && (
                  <div className="package-item">
                    <strong>Tracking:</strong> {order.trackingNumber}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

