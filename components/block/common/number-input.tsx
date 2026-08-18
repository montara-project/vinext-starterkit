'use client'

import React, { ChangeEvent } from 'react'
import { NumericFormat, PatternFormat } from 'react-number-format'

import { cn } from '@/lib/utils'

interface NumberInputProps {
  id?: string
  name?: string
  value?: string | number
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  thousandSeparator?: boolean
  decimalScale?: number
  prefix?: string
  suffix?: string
  allowNegative?: boolean
  disabled?: boolean
  format?: string // For pattern format like phone numbers
  mask?: string
  type?: 'numeric' | 'pattern'
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      id,
      name,
      value,
      onBlur,
      onValueChange,
      placeholder,
      className,
      thousandSeparator = true,
      decimalScale = 2,
      prefix,
      suffix,
      allowNegative = true,
      disabled = false,
      format,
      mask,
      type = 'numeric',
      ...props
    },
    ref
  ) => {
    const baseClassName = cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'md:text-sm font-mono',
      className
    )

    if (type === 'pattern' && format) {
      return (
        <PatternFormat
          getInputRef={ref}
          id={id}
          name={name}
          format={format}
          mask={mask}
          value={value}
          onBlur={onBlur}
          onValueChange={(values) => onValueChange?.(values.value)}
          placeholder={placeholder}
          className={baseClassName}
          disabled={disabled}
          {...props}
        />
      )
    }

    return (
      <NumericFormat
        getInputRef={ref}
        id={id}
        name={name}
        value={value}
        onBlur={onBlur}
        onValueChange={(values) => onValueChange?.(values.value)}
        thousandSeparator={thousandSeparator}
        decimalScale={decimalScale}
        fixedDecimalScale={decimalScale > 0}
        prefix={prefix}
        suffix={suffix}
        allowNegative={allowNegative}
        placeholder={placeholder}
        className={baseClassName}
        disabled={disabled}
        {...props}
      />
    )
  }
)

NumberInput.displayName = 'NumberInput'

export { NumberInput }

/*
Using NumberInput:
## Basic
  <NumberInput
    value={currency}
    onValueChange={setCurrency}
    prefix="$"
    placeholder="Enter amount"
    decimalScale={2}
    thousandSeparator={true}
  />

## Percentage
  <NumberInput
    value={percentage}
    onValueChange={setPercentage}
    suffix="%"
    placeholder="Enter percentage"
    decimalScale={2}
    thousandSeparator={false}
  />

## Phone Number
  <NumberInput
    type="pattern"
    format="(###) ###-####"
    mask="_"
    value={phone}
    onValueChange={setPhone}
    placeholder="(555) 123-4567"
  />

## Credit Card
  <NumberInput
    type="pattern"
    format="#### #### #### ####"
    mask="_"
    value={creditCard}
    onValueChange={setCreditCard}
    placeholder="1234 5678 9012 3456"
  />
*/
