'use client'

import { useSelector } from '@tanstack/react-form'

import ComboboxInput from '@/components/block/common/combobox-input'
import { Field, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/form-context'
import { Option } from '@/types/select'

interface ComboboxFieldProps<TData> {
  label: string
  options: Option<TData>[]
  defaultValue: string
  onSelect?: (value: string) => void
  onAdd?: () => void
}

export default function ComboboxField<TData>({
  label,
  options,
  defaultValue,
  onSelect,
  onAdd,
}: ComboboxFieldProps<TData>) {
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <ComboboxInput
        label={label}
        defaultValue={defaultValue}
        options={options}
        onBlur={field.handleBlur}
        onSelect={(value) => {
          field.handleChange(value)
          onSelect?.(value)
        }}
        onAdd={onAdd}
      />
    </Field>
  )
}
