'use client'

import { useSelector } from '@tanstack/react-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Slider as SliderComponent } from '@/components/ui/slider'
import { useFieldContext } from '@/hooks/form-context'

interface SwitchFieldProps {
  label?: string
}

export default function SliderField({ label }: SwitchFieldProps) {
  const field = useFieldContext<number>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <SliderComponent
        id={label}
        onBlur={field.handleBlur}
        value={[field.state.value]}
        onValueChange={(value) => field.handleChange(value[0])}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
