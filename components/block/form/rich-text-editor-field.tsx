'use client'

import { useSelector } from '@tanstack/react-form'

import { RichTextEditor } from '@/components/block/editor/rich-text-editor'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/form-context'

interface RichTextEditorFieldProps {
  label: string
  placeholder?: string
  asterisk?: boolean
}

export default function RichTextEditorField({
  label,
  placeholder,
  asterisk = false,
}: RichTextEditorFieldProps) {
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="gap-1">
        {label}
        {asterisk && <span className="text-destructive">*</span>}
      </FieldLabel>
      <RichTextEditor
        editorKey={field.name}
        initialHtml={field.state.value}
        hasError={isInvalid}
        onChange={(html) => {
          field.handleChange(html)
          field.handleBlur()
        }}
        placeholder={placeholder}
      />

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
