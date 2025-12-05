import { AlertCircle, Truck, Clock, AlertTriangle } from 'lucide-react'
import './RiskFilterPresets.css'

export type RiskFilterPreset = 'critical' | 'delivery_failures' | 'awaiting_preview' | 'fresh_only' | null

interface RiskFilterPresetsProps {
  activePreset: RiskFilterPreset
  onPresetChange: (preset: RiskFilterPreset) => void
  counts: {
    critical: number
    deliveryFailures: number
    awaitingPreview: number
    freshOnly: number
  }
}

export default function RiskFilterPresets({
  activePreset,
  onPresetChange,
  counts,
}: RiskFilterPresetsProps) {
  const presets = [
    {
      id: 'critical' as RiskFilterPreset,
      label: 'Critical Only',
      icon: AlertCircle,
      count: counts.critical,
      color: '#dc2626',
    },
    {
      id: 'delivery_failures' as RiskFilterPreset,
      label: 'Delivery Failures',
      icon: Truck,
      count: counts.deliveryFailures,
      color: '#dc2626',
    },
    {
      id: 'awaiting_preview' as RiskFilterPreset,
      label: 'Awaiting Preview',
      icon: Clock,
      count: counts.awaitingPreview,
      color: '#f59e0b',
    },
    {
      id: 'fresh_only' as RiskFilterPreset,
      label: 'Fresh Only',
      icon: AlertTriangle,
      count: counts.freshOnly,
      color: '#dc2626',
    },
  ]

  return (
    <div className="risk-filter-presets">
      {presets.map((preset) => {
        const Icon = preset.icon
        const isActive = activePreset === preset.id

        return (
          <button
            key={preset.id}
            className={`risk-preset-chip ${isActive ? 'active' : ''} ${preset.count === 0 ? 'disabled' : ''}`}
            onClick={() => onPresetChange(isActive ? null : preset.id)}
            disabled={preset.count === 0}
          >
            <Icon className="risk-preset-icon" style={{ color: preset.color }} />
            <span className="risk-preset-label">{preset.label}</span>
            {preset.count > 0 && (
              <span className="risk-preset-count" style={{ color: preset.color }}>
                {preset.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

