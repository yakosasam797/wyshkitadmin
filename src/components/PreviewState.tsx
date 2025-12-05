import { Order } from '../types/order'
import { Clock, User, Store, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import './PreviewState.css'

interface PreviewStateProps {
  order: Order
}

export default function PreviewState({ order }: PreviewStateProps) {
  if (!order.previewEnabled) return null

  const now = new Date()
  const latestVersion = order.previewVersions
    ? order.previewVersions[order.previewVersions.length - 1]
    : null

  // Calculate SLA countdown
  const getSlaCountdown = () => {
    if (!order.previewSlaDeadline) return null
    const deadline = new Date(order.previewSlaDeadline)
    const diffMs = deadline.getTime() - now.getTime()

    if (diffMs < 0) {
      const hoursPast = Math.floor(Math.abs(diffMs) / 3600000)
      const minsPast = Math.floor((Math.abs(diffMs) % 3600000) / 60000)
      return {
        text: `-${hoursPast}h ${minsPast}m overdue`,
        isOverdue: true,
      }
    }

    const hours = Math.floor(diffMs / 3600000)
    const mins = Math.floor((diffMs % 3600000) / 60000)
    return {
      text: `${hours}h ${mins}m remaining`,
      isOverdue: false,
    }
  }

  const countdown = getSlaCountdown()

  // Determine waiting party
  const getWaitingParty = () => {
    if (order.status === 'Awaiting Approval') {
      if (latestVersion?.declinedAt) {
        return { party: 'vendor', text: 'Vendor Revision Needed' }
      }
      return { party: 'customer', text: 'Customer Approval Pending' }
    }
    if (order.status === 'Customizing') {
      return { party: 'vendor', text: 'Vendor Uploading Preview' }
    }
    return null
  }

  const waitingParty = getWaitingParty()

  // Get version info
  const versionText = latestVersion
    ? `Preview v${latestVersion.version}`
    : order.previewUrl
      ? 'Preview v1'
      : 'No Preview Yet'

  return (
    <div className="preview-state">
      <div className="preview-state-header">
        <span className="preview-version">{versionText}</span>
        {latestVersion?.approvedAt && (
          <CheckCircle className="preview-status-icon approved" />
        )}
        {latestVersion?.declinedAt && (
          <XCircle className="preview-status-icon declined" />
        )}
      </div>

      {waitingParty && (
        <div className="preview-waiting">
          {waitingParty.party === 'customer' ? (
            <User className="preview-party-icon" />
          ) : (
            <Store className="preview-party-icon" />
          )}
          <span className="preview-waiting-text">{waitingParty.text}</span>
        </div>
      )}

      {countdown && (
        <div className={`preview-countdown ${countdown.isOverdue ? 'overdue' : ''}`}>
          <Clock className="preview-countdown-icon" />
          <span className="preview-countdown-text">SLA {countdown.text}</span>
        </div>
      )}

      {latestVersion?.customerFeedback && (
        <div className="preview-feedback">
          <AlertCircle className="preview-feedback-icon" />
          <span className="preview-feedback-text">Revision Requested</span>
        </div>
      )}
    </div>
  )
}

