'use client'

import { useSelector } from '@tanstack/react-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFieldContext } from '@/hooks/form-context'
import { Option } from '@/types/select'

interface SelectFieldProps<TData> {
  label?: string
  placeholder?: string
  defaultValue?: string
  options: Option<TData>[]
}

export default function SelectField<TData>({
  label,
  placeholder,
  defaultValue,
  options,
}: SelectFieldProps<TData>) {
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        name={field.name}
        value={defaultValue || field.state.value}
        onValueChange={field.handleChange}
        indicatorPosition="right"
      >
        <SelectTrigger id={field.name} aria-invalid={isInvalid} className="h-10 min-w-30">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
          {options.length > 0 ? (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled value="-">
              No options available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
