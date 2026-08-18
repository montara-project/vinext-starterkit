'use client'

import { useSelector } from '@tanstack/react-form'

import { NumberInput } from '@/components/block/common/number-input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/form-context'

interface NumberFieldProps {
  label?: string
  placeholder?: string
}

export default function NumberField({ label, placeholder }: NumberFieldProps) {
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <NumberInput
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onValueChange={(value: string) => field.handleChange(value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
