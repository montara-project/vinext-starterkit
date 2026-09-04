'use client'

import { useSelector } from '@tanstack/react-form'

import ComboboxInput from '@/components/block/common/combobox-input'
import { Field, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/form-context'
import { Option } from '@/types/select'

interface ComboboxFieldProps<TData> {
  label: string
  options: Option<TData>[]
  defaultValues?: string[]
  onSelect?: (value: string) => void
  asterisk?: boolean
}

export default function ComboboxField<TData>({
  label,
  options,
  defaultValues,
  onSelect,
  asterisk = false,
}: ComboboxFieldProps<TData>) {
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="gap-1">
        {label}
        {asterisk && <span className="text-destructive">*</span>}
      </FieldLabel>
      <ComboboxInput
        label={label}
        defaultValues={defaultValues || []}
        options={options}
        onBlur={field.handleBlur}
        onSelect={(value: any) => {
          field.handleChange(value)
          onSelect?.(value)
        }}
      />
    </Field>
  )
}
