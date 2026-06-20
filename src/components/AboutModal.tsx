import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Meta } from '../lib/types'

export default function AboutModal({ meta }: { meta: Meta }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="icon-btn" title="About & data sources" onClick={() => setOpen(true)}>
        ⓘ
      </button>
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal glass" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>
            <h2>PulsePal</h2>
            <p className="modal-tag">
              An interactive 3D atlas of U.S. cardiovascular health by county and state.
            </p>

            {meta.isPlaceholder && (
              <div className="modal-warn">
                <strong>Demo data.</strong> The map currently shows <em>synthetic placeholder</em>{' '}
                values in the exact CDC PLACES schema so every feature works. Run{' '}
                <code>npm run data:scrape</code> after allowlisting <code>data.cdc.gov</code> to load
                real CDC numbers — no code changes needed.
              </div>
            )}

            <h3>How to read it</h3>
            <ul>
              <li>
                Each county/state is <strong>extruded by its metric</strong> — taller and redder
                means higher prevalence.
              </li>
              <li>Hover for exact values; right-drag to tilt &amp; rotate the map.</li>
              <li>Use the time slider, or “Compare years” for a side-by-side of two years.</li>
              <li>Click up to 3 areas (or search) to chart their trend over time.</li>
            </ul>

            <h3>Data</h3>
            <p>
              Measures are age-adjusted prevalence of high blood pressure, coronary heart disease,
              and stroke from{' '}
              <a href={meta.sourceUrl} target="_blank" rel="noreferrer">
                CDC PLACES
              </a>{' '}
              (model-based small-area estimates derived from BRFSS). Geometry from the U.S. Census
              (via <code>us-atlas</code>).
            </p>
            <p className="modal-src">{meta.source}</p>
            {meta.notes?.length > 0 && (
              <ul className="modal-notes">
                {meta.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}

            <div className="modal-foot">
              <Link to="/privacy" onClick={() => setOpen(false)}>
                Privacy Policy
              </Link>
              <span>·</span>
              <Link to="/support" onClick={() => setOpen(false)}>
                Support
              </Link>
              <span>·</span>
              <span className="modal-generated">Data generated {meta.generated}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
