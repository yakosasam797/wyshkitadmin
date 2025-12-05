import { Order } from '../types/order'
import { TrendingDown, AlertCircle, Shield } from 'lucide-react'
import './VendorPerformanceBadge.css'

interface VendorPerformanceBadgeProps {
  order: Order
}

export default function VendorPerformanceBadge({ order }: VendorPerformanceBadgeProps) {
  if (!order.vendorMetrics) return null

  const metrics = order.vendorMetrics

  // Calculate overall risk level
  const getRiskLevel = (): 'low' | 'medium' | 'high' => {
    let riskScore = 0

    if (metrics.credibilityScore < 60) riskScore += 3
    else if (metrics.credibilityScore < 75) riskScore += 1

    if (metrics.slaSuccessRate < 80) riskScore += 2
    else if (metrics.slaSuccessRate < 90) riskScore += 1

    if (metrics.returnsComplaintsRate > 10) riskScore += 3
    else if (metrics.returnsComplaintsRate > 5) riskScore += 1

    if (metrics.previewApprovalRate < 70) riskScore += 2

    if (riskScore >= 5) return 'high'
    if (riskScore >= 2) return 'medium'
    return 'low'
  }

  const riskLevel = getRiskLevel()

  return (
    <div className="vendor-performance-badge">
      <div className="vendor-metrics-row">
        <div className="vendor-metric">
          <span className="vendor-metric-label">Rating</span>
          <span
            className={`vendor-metric-value ${metrics.credibilityScore >= 75 ? 'good' : metrics.credibilityScore >= 60 ? 'medium' : 'poor'}`}
          >
            {metrics.credibilityScore}%
          </span>
        </div>
        <div className="vendor-metric">
          <span className="vendor-metric-label">SLA</span>
          <span
            className={`vendor-metric-value ${metrics.slaSuccessRate >= 90 ? 'good' : metrics.slaSuccessRate >= 80 ? 'medium' : 'poor'}`}
          >
            {metrics.slaSuccessRate.toFixed(0)}%
          </span>
        </div>
      </div>

      {riskLevel !== 'low' && (
        <div className={`vendor-risk-indicator vendor-risk-${riskLevel}`}>
          {riskLevel === 'high' ? (
            <AlertCircle className="vendor-risk-icon" />
          ) : (
            <Shield className="vendor-risk-icon" />
          )}
          <span className="vendor-risk-text">
            Vendor Risk: {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
          </span>
        </div>
      )}

      {metrics.returnsComplaintsRate > 5 && (
        <div className="vendor-refund-risk">
          <TrendingDown className="vendor-refund-icon" />
          <span className="vendor-refund-text">
            Refund Risk: {metrics.returnsComplaintsRate.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  )
}

