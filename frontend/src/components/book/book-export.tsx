import { useState } from 'react'
import { exportBooks, downloadBlob } from '../../services/export-import'
import { toastError } from '../../lib/toast'

export default function BookExport() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<'json' | 'csv' | null>(null)

  async function handleExport(format: 'json' | 'csv') {
    setLoading(format)
    try {
      const blob = await exportBooks(format)
      const ext = format === 'json' ? 'json' : 'csv'
      downloadBlob(blob, `biblioteca.${ext}`)
    } catch {
      toastError('Error al exportar')
    } finally {
      setLoading(null)
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Exportar biblioteca"
        className="rounded-pill px-3.5 py-1.5 text-caption-uppercase bg-surface-strong text-muted hover:text-ink transition-colors flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Exportar
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            role="menu"
            aria-label="Opciones de exportación"
            className="absolute right-0 top-full mt-1 z-20 w-36 rounded-lg border border-hairline bg-surface-card shadow-card overflow-hidden"
          >
            <button
              role="menuitem"
              onClick={() => handleExport('json')}
              disabled={loading === 'json'}
              className="w-full px-4 py-2.5 text-body-sm text-ink hover:bg-surface-strong transition-colors text-left disabled:opacity-50"
            >
              {loading === 'json' ? 'Exportando...' : 'Exportar JSON'}
            </button>
            <button
              role="menuitem"
              onClick={() => handleExport('csv')}
              disabled={loading === 'csv'}
              className="w-full px-4 py-2.5 text-body-sm text-ink hover:bg-surface-strong transition-colors text-left disabled:opacity-50 border-t border-hairline"
            >
              {loading === 'csv' ? 'Exportando...' : 'Exportar CSV'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
