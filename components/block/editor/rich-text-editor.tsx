import { useMemo } from 'react'

import { getExtension, Provider } from '@/components/block/editor/editor-system'
import { cn } from '@/lib/utils'

import EditorInner from './editor-inner'
import EditorToolbar from './editor-toolbar'
import { shadcnTheme } from './theme'

interface RichTextEditorProps {
  initialHtml?: string
  onChange?: (html: string) => void
  editorKey?: string | number
  hasError?: string
  className?: string
  placeholder?: string
}

export function RichTextEditor({
  initialHtml,
  onChange,
  editorKey,
  hasError,
  className,
  placeholder,
}: RichTextEditorProps) {
  const extensions = useMemo(() => getExtension({ placeholder }), [placeholder])

  return (
    <div
      dir="ltr"
      className={cn(
        'bg-background overflow-hidden rounded-lg border transition-colors',
        'focus-within:border-[#2c3892] focus-within:ring-2 focus-within:ring-[#2c3892]/15',
        hasError && 'border-destructive',
        className
      )}
    >
      <Provider key={editorKey} extensions={extensions} config={{ theme: shadcnTheme }}>
        <EditorToolbar />
        <EditorInner initialHtml={initialHtml} onChange={onChange} />
      </Provider>
    </div>
  )
}
