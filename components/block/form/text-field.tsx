'use client'

import { IconCheck } from '@tabler/icons-react'
import { useSelector } from '@tanstack/react-form'
import { VariantProps } from 'class-variance-authority'
import { ChangeEvent } from 'react'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input, inputVariants, InputWrapper } from '@/components/ui/input'
import { useFieldContext } from '@/hooks/form-context'

type InputProps = React.ComponentProps<'input'> & VariantProps<typeof inputVariants>

type TextFieldProps = InputProps & {
  label?: string
  onChange?: (value: string) => void
  icon?: typeof IconCheck
  asterisk?: boolean
}

export default function TextField({
  label,
  placeholder,
  onChange,
  disabled,
  asterisk = false,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string | number>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="gap-1">
        {label}
        {asterisk && <span className="text-destructive">*</span>}
      </FieldLabel>
      <InputWrapper className="h-10">
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
          {...props}
        />
      </InputWrapper>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
