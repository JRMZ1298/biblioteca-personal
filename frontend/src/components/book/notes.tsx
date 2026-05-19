interface NotesProps {
  value: string | null
  onChange: (notes: string) => void
}

export default function Notes({ value, onChange }: NotesProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-caption font-medium text-body-strong">Notas</label>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tus notas personales sobre este libro…"
        rows={4}
        className="block w-full rounded-md border border-hairline-strong bg-surface-card px-4 py-3 text-body-md text-ink shadow-sm transition-colors placeholder:text-muted-soft focus:outline-none focus:border-ink focus:ring-0 resize-y min-h-[80px]"
      />
    </div>
  )
}
