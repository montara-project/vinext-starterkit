'use client'

import { useSelector } from '@tanstack/react-form'

import { Field, FieldLabel } from '@/components/ui/field'
import { Rating } from '@/components/ui/rating'
import { useFieldContext } from '@/hooks/form-context'

interface RatingFieldProps {
  label?: string
  asterisk?: boolean
}

export default function RatingField({ label, asterisk = false }: RatingFieldProps) {
  const field = useFieldContext<number>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!errors?.length

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="gap-1">
        {label}
        {asterisk && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Rating
        rating={field.state.value}
        editable={true}
        onRatingChange={(rating) => field.handleChange(rating)}
        showValue={true}
      />
    </Field>
  )
}
