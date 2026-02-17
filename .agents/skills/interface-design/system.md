# LIMS Interface Design System

## Product Context
LIMS (Laboratory Information Management System). Users are lab technicians and coordinators in an operational environment. They need precision and efficiency, not decoration.

## Direction & Feel
**Cold precision with semantic warmth.** Like a lab instrument panel — clean white surfaces, information dense, every element earns its space. Color communicates state, not mood.

## Depth Strategy
**Borders-only** for structure. Subtle `shadow-soft` for containers. No dramatic shadows.
- Card/list containers: `border border-surface-100 rounded-xl shadow-soft`
- Row separators: `border-b border-surface-100`
- Left-border status indicator (4px): key list pattern (see below)

## Spacing
Base unit: 4px (Tailwind default). Prefer `p-3`/`p-6` for containers, `gap-2`/`gap-4` for grids.

## Typography
- Page title: `text-2xl font-bold text-surface-900 tracking-tight`
- Section label: `text-xs font-semibold text-surface-500 uppercase tracking-wide`
- Table data: `text-sm`
- Secondary/metadata: `text-xs text-surface-400`
- Clickable entity name: `font-medium text-surface-900 hover:text-primary-700 hover:underline cursor-pointer`

## Color Tokens (always use semantic names, never hardcoded hex/gray-XXX)
- Actions primary: `text-primary-700`, `hover:bg-primary-50`
- Success/complete: `text-success-700`, `bg-success-500`
- Warning/pending: `text-warning-600`, `bg-warning-400`
- Destructive: `text-danger-600`, `hover:bg-danger-50`
- Neutral text: `text-surface-900` (primary), `text-surface-600` (secondary), `text-surface-400` (tertiary)
- Surfaces: `bg-white` (cards), `bg-surface-50` (hover/alt rows), `bg-surface-100` (header rows)

## Key Patterns

### List rows with status left-border
Worklist rows use a 4px left border coded by state:
```
lotesPendientes > 0   → border-l-warning-400  (material awaited)
pct === 100           → border-l-success-500  (complete)
pct > 0               → border-l-primary-400  (in progress)
default               → border-l-surface-200  (not started)
```
Row class: `group grid grid-cols-12 gap-2 pl-3 pr-3 py-3 border-l-4 {leftBorder} hover:bg-surface-50 transition-colors items-center text-sm`

### Entity name as primary navigation
In lists, the entity name is the primary navigation trigger (not a separate Edit button):
```tsx
<button
  onClick={() => onEdit(item)}
  className="font-medium text-surface-900 hover:text-primary-700 hover:underline text-left transition-colors"
>
  {item.nombre}
</button>
```
Action buttons (edit/delete) are secondary: neutral gray by default, colored on hover. Use `group` on row and `group-hover:text-surface-500` on actions to reveal them subtly.

### Progress display (combined column)
Replace separate Total/Completadas/Progreso columns with one "Avance" column:
```tsx
<div className="space-y-1.5">
  <div className="flex items-baseline justify-between gap-2">
    <span className="text-sm font-semibold text-surface-700 tabular-nums">
      {completadas}<span className="font-normal text-surface-400"> / {total}</span>
    </span>
    <span className="text-xs text-surface-400 tabular-nums">{pct}%</span>
  </div>
  <div className="w-full bg-surface-100 rounded-full h-1.5 overflow-hidden">
    <div className={`${barColor} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
  </div>
</div>
```

### Page header with inline stats
```tsx
<div>
  <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{title}</h1>
  <div className="flex items-center gap-5 mt-1.5 text-sm text-surface-500">
    <span><span className="font-semibold text-surface-700">{total}</span> items</span>
    <span><span className="font-semibold text-primary-700">{inProgress}</span> en progreso</span>
    <span><span className="font-semibold text-success-700">{completed}</span> completadas</span>
  </div>
</div>
```

### Search input
```tsx
<div className="relative w-72">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" size={15} />
  <input
    className="w-full pl-9 pr-4 py-2 text-sm border border-surface-200 rounded-lg bg-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
  />
</div>
```

### Loading spinner
```tsx
<div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
```
Not `border-b-2 border-blue-600`. Prefer the CSS ring approach.

### Empty state
```tsx
<div className="text-center py-16 bg-white border border-surface-100 rounded-xl">
  <Icon size={40} className="mx-auto text-surface-300 mb-3" />
  <h3 className="text-sm font-semibold text-surface-700 mb-1">{title}</h3>
  <p className="text-sm text-surface-400 max-w-xs mx-auto">{description}</p>
  <Button variant="soft" className="mt-4">{action}</Button>
</div>
```

## Grid System for Lists
12-column grid. Prefer fewer, wider columns over many narrow ones:
- Primary entity field: span 4
- Secondary descriptive: span 2-3
- Combined metric: span 3
- Date/metadata: span 1-2
- Actions: span 1
