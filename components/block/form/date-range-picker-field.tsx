import { useSelector } from '@tanstack/react-form'
import { DateRange } from 'react-day-picker'

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/form-context'

import DateRangePickerInput from '../common/date_range-picker-input'

interface DateRangePickerFieldProps {
  label?: string
  placeholder?: string
  defaultValue?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  note?: string
  asterisk?: boolean
  disabledPast?: boolean
}

export default function DateRangePickerField({
  label,
  placeholder,
  defaultValue,
  onDateChange,
  note,
  asterisk = false,
  disabledPast = false,
}: DateRangePickerFieldProps) {
  const field = useFieldContext<DateRange>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="gap-1">
        {label}
        {asterisk && <span className="text-destructive">*</span>}
      </FieldLabel>
      <DateRangePickerInput
        date={field.state.value || defaultValue}
        onDateChange={(date) => {
          if (date) {
            field.handleChange(date)
            onDateChange?.(date)
          }
        }}
        placeholder={placeholder}
        disabledPast={disabledPast}
      />
      {note && <FieldDescription>{note}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
