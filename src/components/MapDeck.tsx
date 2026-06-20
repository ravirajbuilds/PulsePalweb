import { useMemo, useState } from 'react'
import DeckGL from '@deck.gl/react'
import { GeoJsonLayer } from '@deck.gl/layers'
import { AmbientLight, DirectionalLight, LightingEffect } from '@deck.gl/core'
import type { AreaSelection, GeoFeature, GeoMode, Measure } from '../lib/types'
import { fillColor, elevation } from '../lib/colors'
import { formatValue } from '../lib/format'
import { BASE_ELEVATION, COMPARE_RGB } from '../lib/constants'
import { useStore } from '../store'

// Soft studio lighting so the extruded heights read clearly in 3D.
const lightingEffect = new LightingEffect({
  ambient: new AmbientLight({ color: [255, 255, 255], intensity: 1.05 }),
  sun: new DirectionalLight({ color: [255, 255, 255], intensity: 1.3, direction: [-1, -3, -1] }),
  fill: new DirectionalLight({ color: [255, 235, 240], intensity: 0.6, direction: [2, 1, -1] }),
})

const NO_DATA_LINE: [number, number, number, number] = [12, 16, 28, 140]

interface Props {
  features: GeoFeature[]
  values: Record<string, number>
  measure: Measure
  mode: GeoMode
  yearLabel: number
  side?: 'A' | 'B'
}

interface Hover {
  x: number
  y: number
  id: string
  name: string
  st: string
  value: number | undefined
}

export default function MapDeck({ features, values, measure, mode, yearLabel, side }: Props) {
  const viewState = useStore((s) => s.viewState)
  const setViewState = useStore((s) => s.setViewState)
  const exaggeration = useStore((s) => s.exaggeration)
  const selections = useStore((s) => s.selections)
  const highlightId = useStore((s) => s.highlightId)
  const toggleSelection = useStore((s) => s.toggleSelection)
  const [hover, setHover] = useState<Hover | null>(null)

  const selIndex = useMemo(() => {
    const m = new Map<string, number>()
    selections.forEach((s, i) => m.set(s.id, i))
    return m
  }, [selections])
  const selKey = selections.map((s) => s.id).join(',')

  const layer = useMemo(
    () =>
      new GeoJsonLayer({
        id: `geo-${mode}-${side ?? 'main'}`,
        data: features as any,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: true,
        wireframe: false,
        elevationScale: exaggeration,
        getElevation: (f: any) => elevation(values[f.id], measure.elevationDomain, BASE_ELEVATION),
        getFillColor: (f: any) => fillColor(values[f.id], measure.colorDomain, 235),
        getLineColor: (f: any) => {
          const idx = selIndex.get(f.id)
          if (idx != null) return [...COMPARE_RGB[idx], 255] as [number, number, number, number]
          if (highlightId === f.id) return [255, 255, 255, 255] as [number, number, number, number]
          return NO_DATA_LINE
        },
        getLineWidth: (f: any) =>
          selIndex.has(f.id) || highlightId === f.id ? 3 : mode === 'state' ? 1 : 0.4,
        lineWidthUnits: 'pixels',
        lineWidthMinPixels: 0.3,
        material: { ambient: 0.55, diffuse: 0.65, shininess: 28, specularColor: [40, 40, 50] },
        autoHighlight: true,
        highlightColor: [255, 255, 255, 50],
        onHover: (info) => {
          const f = info.object as GeoFeature | undefined
          if (!f) return setHover(null)
          setHover({
            x: info.x,
            y: info.y,
            id: f.id,
            name: f.properties.name,
            st: f.properties.st,
            value: values[f.id],
          })
        },
        onClick: (info) => {
          const f = info.object as GeoFeature | undefined
          if (!f) return
          const label = mode === 'county' ? `${f.properties.name}, ${f.properties.st}` : f.properties.name
          toggleSelection({ kind: mode, id: f.id, label } as AreaSelection)
        },
        updateTriggers: {
          getFillColor: [measure.id, yearLabel],
          getElevation: [measure.id, yearLabel, mode],
          getLineColor: [selKey, highlightId],
          getLineWidth: [selKey, highlightId, mode],
        },
      }),
    [features, values, measure, mode, side, exaggeration, selIndex, selKey, highlightId, yearLabel, toggleSelection],
  )

  return (
    <div className="map-deck">
      <DeckGL
        style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
        viewState={viewState}
        onViewStateChange={(e: any) => setViewState(e.viewState)}
        controller={{ dragRotate: true, touchRotate: true, inertia: true } as any}
        effects={[lightingEffect]}
        layers={[layer]}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
      />
      {side && <div className="map-side-badge">{yearLabel}</div>}
      {hover && (
        <div className="map-tooltip" style={{ left: hover.x + 14, top: hover.y + 14 }}>
          <div className="tt-title">
            {hover.name}
            {hover.st ? <span className="tt-st">{hover.st}</span> : null}
          </div>
          <div className="tt-row">
            <span className="tt-metric">{measure.short}</span>
            <span className="tt-value">{formatValue(hover.value, measure.unit)}</span>
          </div>
          <div className="tt-foot">
            {yearLabel} · {measure.unit} ·{' '}
            {selIndex.has(hover.id) ? 'in comparison' : 'click to compare'}
          </div>
        </div>
      )}
    </div>
  )
}
