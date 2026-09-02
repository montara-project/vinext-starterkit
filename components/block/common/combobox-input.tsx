'use client'

import { IconX } from '@tabler/icons-react'
import React, { useState } from 'react'

import { Badge, BadgeButton } from '@/components/ui/badge'
import { Button, ButtonArrow } from '@/components/ui/button'
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Option } from '@/types/select'

interface ComboboxInputProps<TData> {
  options: Option<TData>[]
  label: string
  defaultValues: string[]
  onSelect: (value: string[]) => void
  onBlur?: () => void
}

export default function ComboboxInput<TData>({
  options,
  defaultValues,
  label,
  onSelect,
  onBlur,
}: ComboboxInputProps<TData>) {
  const [open, setOpen] = useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValues)

  const toggleSelection = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
    onSelect(
      selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value]
    )
  }

  const removeSelection = (value: string) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value))
    onSelect(selectedValues.filter((v) => v !== value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          autoHeight={true}
          mode="input"
          placeholder={selectedValues.length === 0}
          className="relative w-full p-1"
        >
          <div className="flex flex-wrap items-center gap-1 pe-2.5">
            {selectedValues.length > 0 ? (
              selectedValues.map((val) => {
                const item = options.find((c) => c.value === val)
                return item ? (
                  <Badge key={val} variant="outline" className="text-primary bg-ivory font-medium">
                    {item.label}
                    <BadgeButton
                      className="text-primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeSelection(val)
                      }}
                    >
                      <IconX />
                    </BadgeButton>
                  </Badge>
                ) : null
              })
            ) : (
              <span className="px-2.5">{label}</span>
            )}
          </div>
          <ButtonArrow className="absolute inset-e-3 top-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => toggleSelection(item.value)}
                    onBlur={onBlur}
                  >
                    <span className="truncate">{item.label}</span>
                    {selectedValues.includes(item.value) && <CommandCheck />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
