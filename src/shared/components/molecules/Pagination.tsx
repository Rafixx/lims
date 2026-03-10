import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export const Pagination = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange
}: PaginationProps) => {
  if (totalPages <= 1 && totalItems <= pageSize) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', page - 1, page, page + 1, '...', totalPages]
  }

  const btnBase = 'min-w-[32px] h-8 px-2 rounded text-sm font-medium transition-colors'
  const btnActive = `${btnBase} bg-primary-600 text-white`
  const btnInactive = `${btnBase} text-surface-600 hover:bg-surface-100`
  const btnDisabled = `${btnBase} text-surface-300 cursor-not-allowed`

  return (
    <div className="flex items-center justify-between px-3 py-3 border-t border-surface-100">
      <div className="flex items-center gap-3 text-xs text-surface-500">
        <span>
          {start}–{end} de {totalItems}
        </span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className="border border-surface-200 rounded px-1 py-0.5 text-xs text-surface-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {[10, 20, 50, 100].map(s => (
              <option key={s} value={s}>{s} / página</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={page === 1 ? btnDisabled : btnInactive}
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-surface-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={page === p ? btnActive : btnInactive}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={page === totalPages ? btnDisabled : btnInactive}
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
