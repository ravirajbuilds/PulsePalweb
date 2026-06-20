import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export const SUPPORT_EMAIL = 'vs.vegesna@gmail.com'

export default function DocLayout({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <div className="doc-page">
      <header className="doc-header">
        <Link to="/" className="doc-brand">
          <span className="brand-pulse" aria-hidden />
          <span>PulsePal</span>
        </Link>
        <nav className="doc-nav">
          <Link to="/">Atlas</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/support">Support</Link>
        </nav>
      </header>

      <main className="doc">
        <h1>{title}</h1>
        <p className="doc-updated">Last updated: {updated}</p>
        {children}
        <footer className="doc-footer">
          <p>
            PulsePal · U.S. Cardiovascular Health Atlas · Questions?{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
          <p>
            <Link to="/">Back to the atlas</Link> · <Link to="/privacy">Privacy</Link> ·{' '}
            <Link to="/support">Support</Link>
          </p>
        </footer>
      </main>
    </div>
  )
}
