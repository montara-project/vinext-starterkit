'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type CheckboxProps = React.ComponentProps<typeof Checkbox>

type CheckboxInputProps = {
  id: string
  label: string
} & CheckboxProps

export default function CheckboxInput({ id, label, ...props }: CheckboxInputProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Checkbox id={id} {...props} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}
