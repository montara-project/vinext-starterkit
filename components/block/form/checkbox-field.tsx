'use client'

import { useSelector } from '@tanstack/react-form'

import { Field, FieldError } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/form-context'

import CheckboxInput from '../common/checkbox-input'

interface CheckboxFieldProps {
  label?: string
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export default function CheckboxField({ label, onCheckedChange, disabled }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <CheckboxInput
        id={field.name}
        label={label || ''}
        onBlur={field.handleBlur}
        checked={field.state.value}
        disabled={disabled}
        onCheckedChange={(checked) => {
          const isChecked = checked === true
          field.handleChange(isChecked)
          onCheckedChange(isChecked)
        }}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
