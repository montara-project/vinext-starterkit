'use client'

import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useSelector } from '@tanstack/react-form'
import { VariantProps } from 'class-variance-authority'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input, inputVariants } from '@/components/ui/input'
import { useFieldContext } from '@/hooks/form-context'

type PasswordInputProps = React.ComponentProps<'input'> &
  VariantProps<typeof inputVariants> & {
    label?: string
    asterisk?: boolean
  }

export default function PasswordField({
  label,
  placeholder,
  asterisk = false,
  ...props
}: PasswordInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false)

  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="gap-1">
        {label}
        {asterisk && <span className="text-destructive">*</span>}
      </FieldLabel>
      <div className="relative">
        <Input
          type={passwordVisible ? 'text' : 'password'}
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder={placeholder}
          autoComplete="off"
          variant="lg"
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          mode="icon"
          size="sm"
          onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
          className="absolute inset-e-0 top-1/2 me-1.5 h-7 w-7 -translate-y-1/2 bg-transparent!"
          aria-label={passwordVisible ? 'Hide password' : 'Show password'}
        >
          {passwordVisible ? (
            <IconEyeOff className="text-muted-foreground" />
          ) : (
            <IconEye className="text-muted-foreground" />
          )}
        </Button>
      </div>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
