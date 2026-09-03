'use client'

import { useSelector } from '@tanstack/react-form'

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/form-context'

import DatePickerInput from '../common/date-picker-input'

interface DatePickerFieldProps {
  label?: string
  placeholder?: string
  defaultValue?: Date
  onDateChange?: (date: Date | undefined) => void
  note?: string
  asterisk?: boolean
  minDate?: Date
}

export default function DatePickerField({
  label,
  placeholder,
  defaultValue,
  onDateChange,
  note,
  asterisk,
  minDate,
}: DatePickerFieldProps) {
  const field = useFieldContext<Date | undefined>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="gap-1">
        {label}
        {asterisk && <span className="text-destructive">*</span>}
      </FieldLabel>
      <DatePickerInput
        date={field.state.value || defaultValue}
        onDateChange={(date) => {
          field.handleChange(date)
          onDateChange?.(date)
        }}
        placeholder={placeholder}
        minDate={minDate}
      />
      {note && <FieldDescription>{note}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
