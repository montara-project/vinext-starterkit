'use client'

import { useSelector } from '@tanstack/react-form'

import { RichTextEditor } from '@/components/block/editor/rich-text-editor'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/form-context'

interface RichTextEditorFieldProps {
  label: string
}

export default function RichTextEditorField({ label }: RichTextEditorFieldProps) {
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <RichTextEditor
        editorKey={field.name}
        initialHtml={field.state.value}
        onChange={(html) => field.handleChange(html)}
      />

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
