'use client'

import { useSelector } from '@tanstack/react-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useFieldContext } from '@/hooks/form-context'

interface Option<T> {
  value: string
  label: string
  original?: T
}

interface SelectGroupFieldProps<T extends Record<string, unknown>> {
  label?: string
  placeholder?: string
  defaultValue?: string
  options: Option<T>[]
  childLabel: keyof T
  childValue: keyof T
}

export default function SelectGroupField<T extends Record<string, any>>({
  label,
  placeholder,
  defaultValue,
  options,
  childLabel,
  childValue,
}: SelectGroupFieldProps<T>) {
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  const renderSelectGroup = () => {
    if (options.length > 0) {
      return options.map((item, index) => {
        const children = item.original?.children ?? []

        const childOptions = children.map((child: any) => ({
          value: String(child[childValue]),
          label: String(child[childLabel]),
        }))

        const isLastGroup = index === options.length - 1

        return (
          <>
            <SelectGroup>
              <SelectLabel>{item.label}</SelectLabel>
              {childOptions.length > 0 &&
                childOptions.map((child: any) => (
                  <SelectItem key={child.value} value={child.value}>
                    {child.label}
                  </SelectItem>
                ))}
            </SelectGroup>

            {!isLastGroup && <Separator className="my-1" />}
          </>
        )
      })
    }

    return (
      <SelectItem disabled value="-">
        No options available
      </SelectItem>
    )
  }

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        name={field.name}
        value={defaultValue || field.state.value}
        onValueChange={field.handleChange}
      >
        <SelectTrigger id={field.name} aria-invalid={isInvalid} className="h-10 min-w-30">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">{renderSelectGroup()}</SelectContent>
      </Select>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
