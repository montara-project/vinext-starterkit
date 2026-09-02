'use client'

import { useSelector } from '@tanstack/react-form'

import { NumberInput, NumberInputProps } from '@/components/block/common/number-input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/form-context'

interface NumberFieldProps extends NumberInputProps {
  label?: string
  placeholder?: string
  asterisk?: boolean
}

export default function NumberField({ label, placeholder, asterisk, ...props }: NumberFieldProps) {
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="gap-1">
        {label}
        {asterisk && <span className="text-destructive">*</span>}
      </FieldLabel>
      <NumberInput
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onValueChange={(value: string) => field.handleChange(value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        {...props}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
