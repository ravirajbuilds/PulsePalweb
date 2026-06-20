import type { Meta } from '../lib/types'
import { legendGradient } from '../lib/colors'
import { useStore } from '../store'

export default function Legend({ meta }: { meta: Meta }) {
  const measureId = useStore((s) => s.measureId)
  const exaggeration = useStore((s) => s.exaggeration)
  const setExaggeration = useStore((s) => s.setExaggeration)
  const measure = meta.measures.find((m) => m.id === measureId) ?? meta.measures[0]
  const [lo, hi] = measure.colorDomain

  return (
    <div className="legend glass">
      <div className="legend-title">
        {measure.label}
        <span className="legend-unit">{measure.unit}</span>
      </div>
      <div className="legend-bar" style={{ background: legendGradient() }} />
      <div className="legend-scale">
        <span>{lo}</span>
        <span className="legend-mid">higher prevalence →</span>
        <span>{hi}</span>
      </div>
      <div className="legend-hint">
        Taller + redder = higher {measure.short.toLowerCase()}. Right-drag to tilt &amp; rotate.
      </div>
      <div className="legend-exag">
        <span>Height</span>
        <input
          type="range"
          min={0.3}
          max={4}
          step={0.1}
          value={exaggeration}
          onChange={(e) => setExaggeration(Number(e.target.value))}
          aria-label="3D height exaggeration"
        />
        <span className="exag-val">{exaggeration.toFixed(1)}×</span>
      </div>
    </div>
  )
}
