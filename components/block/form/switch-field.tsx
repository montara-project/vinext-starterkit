'use client'

import { useSelector } from '@tanstack/react-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Switch as SwitchComponent } from '@/components/ui/switch'
import { useFieldContext } from '@/hooks/form-context'

interface SwitchFieldProps {
  label?: string
  onCheckedChange: (checked: boolean) => void
  asterisk?: boolean
}

export default function SwitchField({
  label,
  onCheckedChange,
  asterisk = false,
}: SwitchFieldProps) {
  const field = useFieldContext<boolean>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel htmlFor={field.name} className="gap-1">
          {label}
          {asterisk && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <SwitchComponent
        id={label}
        onBlur={field.handleBlur}
        checked={field.state.value}
        onCheckedChange={(checked) => {
          field.handleChange(checked)
          onCheckedChange(checked)
        }}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
