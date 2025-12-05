import { Order } from '../types/order'

export type PriorityLevel = 'critical' | 'at-risk' | 'healthy'

export interface PriorityInfo {
  level: PriorityLevel
  score: number
  tags: string[]
  reasons: string[]
}

/**
 * Calculate priority level and tags for an order
 * Returns: critical, at-risk, or healthy
 */
export function calculateOrderPriority(order: Order): PriorityInfo {
  const tags: string[] = []
  const reasons: string[] = []
  let score = 0
  const now = new Date()

  // Check for SLA breaches (CRITICAL)
  if (order.slaBreachAt) {
    const breachTime = new Date(order.slaBreachAt)
    if (breachTime < now) {
      score += 1000
      tags.push('SLA Breach')
      reasons.push('SLA has been breached')
    }
  }

  // Preview SLA checks
  if (order.previewSlaDeadline && order.status === 'Awaiting Approval') {
    const deadline = new Date(order.previewSlaDeadline)
    const diffMs = deadline.getTime() - now.getTime()
    const diffMins = diffMs / (1000 * 60)

    if (diffMs < 0) {
      score += 800
      tags.push('Preview Overdue')
      reasons.push('Preview SLA overdue')
    } else if (diffMins <= 60) {
      score += 300
      tags.push('Preview At Risk')
      reasons.push('Preview deadline within 1 hour')
    }
  }

  // Fresh Perishable checks (CRITICAL priority)
  if (order.productType === 'Fresh Perishable') {
    tags.push('FRESH')
    score += 500

    if (order.packingDeadline) {
      const deadline = new Date(order.packingDeadline)
      const diffMs = deadline.getTime() - now.getTime()
      const diffMins = diffMs / (1000 * 60)

      if (diffMs < 0) {
        score += 900
        tags.push('Fresh SLA Breached')
        reasons.push('Fresh packing deadline breached')
      } else if (diffMins <= 45) {
        score += 400
        tags.push('Fresh High Risk')
        reasons.push('Fresh packing deadline within 45 mins')
      }
    }

    if (order.requiredDeliveryBy) {
      const requiredBy = new Date(order.requiredDeliveryBy)
      const diffMs = requiredBy.getTime() - now.getTime()
      const diffHours = diffMs / (1000 * 60 * 60)

      if (diffHours <= 2) {
        score += 600
        tags.push('Fresh Delivery Urgent')
        reasons.push('Fresh delivery within 2 hours')
      }
    }
  }

  // Delivery issues
  if (order.status === 'Out for Delivery' && order.outForDeliverySince) {
    const since = new Date(order.outForDeliverySince)
    const diffMs = now.getTime() - since.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours > 24) {
      score += 700
      tags.push('Delivery Delay')
      reasons.push('Stuck in delivery for over 24 hours')
    }
  }

  // RTO status
  if (order.rtoStatus && order.rtoStatus !== 'none') {
    score += 600
    tags.push('RTO Initiated')
    reasons.push('Return to origin initiated')
  }

  // Customer complaints
  if (order.customerComplaint && !order.customerComplaint.resolved) {
    score += 500
    tags.push('Complaint Raised')
    reasons.push('Customer complaint pending resolution')
  }

  // Critical alerts
  const criticalAlerts = order.adminFlags.filter(
    (f) => f.priority === 'critical' && !f.resolvedAt
  )
  if (criticalAlerts.length > 0) {
    score += criticalAlerts.length * 400
    tags.push(`Critical Alerts (${criticalAlerts.length})`)
    reasons.push(`${criticalAlerts.length} critical alert(s)`)
  }

  // High priority alerts
  const highAlerts = order.adminFlags.filter(
    (f) => f.priority === 'high' && !f.resolvedAt
  )
  if (highAlerts.length > 0) {
    score += highAlerts.length * 200
    if (!tags.includes('Critical Alerts')) {
      tags.push(`High Priority Alerts (${highAlerts.length})`)
    }
    reasons.push(`${highAlerts.length} high priority alert(s)`)
  }

  // Vendor delay
  if (order.vendorDelayMinutes && order.vendorDelayMinutes > 60) {
    score += 250
    tags.push('Vendor Delay')
    reasons.push(`Vendor delayed by ${Math.floor(order.vendorDelayMinutes / 60)}h`)
  }

  // Determine priority level
  let level: PriorityLevel = 'healthy'
  if (score >= 800) {
    level = 'critical'
  } else if (score >= 200) {
    level = 'at-risk'
  }

  return {
    level,
    score,
    tags: [...new Set(tags)], // Remove duplicates
    reasons,
  }
}

/**
 * Get priority color scheme
 */
export function getPriorityColorScheme(level: PriorityLevel): {
  bgColor: string
  borderColor: string
  textColor: string
} {
  switch (level) {
    case 'critical':
      return {
        bgColor: '#fef2f2',
        borderColor: '#dc2626',
        textColor: '#991b1b',
      }
    case 'at-risk':
      return {
        bgColor: '#fffbeb',
        borderColor: '#f59e0b',
        textColor: '#92400e',
      }
    default:
      return {
        bgColor: '#ffffff',
        borderColor: '#e5e7eb',
        textColor: '#1f2937',
      }
  }
}

