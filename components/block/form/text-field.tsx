'use client'

import { useSelector } from '@tanstack/react-form'
import { LucideProps } from 'lucide-react'
import { ChangeEvent, ForwardRefExoticComponent, RefAttributes } from 'react'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input, InputWrapper } from '@/components/ui/input'
import { useFieldContext } from '@/hooks/form-context'

interface TextFieldProps {
  label?: string
  placeholder?: string
  onChange?: (value: string) => void
  icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  disabled?: boolean
}

export default function TextField({
  label,
  placeholder,
  onChange,
  disabled,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string | number>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputWrapper>
        {props.icon && <props.icon />}
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            field.handleChange(e.target.value)
            onChange?.(e.target.value)
          }}
          aria-invalid={isInvalid}
          placeholder={placeholder}
          variant="lg"
          disabled={disabled}
        />
      </InputWrapper>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
