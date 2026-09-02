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
import { cn } from '@/lib/utils'
import { Option } from '@/types/select'

interface SelectFieldProps<TData> {
  label?: string
  placeholder?: string
  defaultValue?: string
  options: Option<TData>[]
  onSelect?: (value: string) => void
  itemRender?: (option: Option<TData>) => React.ReactNode
  className?: string
  loading?: boolean
  asterisk?: boolean
  disabled?: boolean
}

export default function SelectField<TData>({
  label,
  placeholder,
  defaultValue,
  options,
  onSelect,
  itemRender,
  className,
  loading = false,
  asterisk = false,
  disabled = false,
}: SelectFieldProps<TData>) {
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="gap-1">
        {label}
        {asterisk && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Select
        name={field.name}
        value={defaultValue || field.state.value}
        onValueChange={(value) => {
          field.handleChange(value)
          onSelect?.(value)
        }}
        indicatorPosition="right"
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={isInvalid}
          className={cn('h-10 min-w-30', className)}
          disabled={disabled}
        >
          <SelectValue placeholder={loading ? 'Loading...' : placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
          {loading ? (
            <SelectItem disabled value="-">
              Loading...
            </SelectItem>
          ) : options.length > 0 ? (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {itemRender && itemRender(option)}
                {!itemRender && option.label}
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
