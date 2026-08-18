'use client'

import { Plus } from 'lucide-react'
import React, { useState } from 'react'

import { Button, ButtonArrow } from '@/components/ui/button'
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Option } from '@/types/select'

interface ComboboxInputProps<TData> {
  options: Option<TData>[]
  label: string
  defaultValue: string
  onSelect: (value: string) => void
  onBlur?: () => void
  onAdd?: () => void
}

export default function ComboboxInput<TData>({
  options,
  defaultValue,
  label,
  onSelect,
  onBlur,
  onAdd,
}: ComboboxInputProps<TData>) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          mode="input"
          placeholder={!defaultValue}
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className={cn('truncate')}>
            {defaultValue
              ? options.find((item) => item.value === defaultValue)?.label
              : `Select a ${label}...`}
          </span>
          <ButtonArrow />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder={`Search ${label}...`} />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
              <CommandEmpty>No {label} found.</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onBlur={onBlur}
                    onSelect={(currentValue) => {
                      onSelect(currentValue === defaultValue ? '' : (currentValue ?? ''))
                      setOpen(false)
                    }}
                  >
                    {item.label}
                    {defaultValue === item.value && <CommandCheck />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>

          {onAdd && (
            <React.Fragment>
              <CommandSeparator />
              <CommandGroup>
                <Button
                  variant="outline"
                  className="w-full justify-start border-blue-300 bg-blue-100 px-2.5 font-normal text-blue-600 transition-colors delay-200 hover:border-blue-400 hover:bg-blue-200 hover:text-blue-600"
                  onClick={onAdd}
                >
                  <Plus className="size-4 text-blue-600" aria-hidden="true" />
                  Add {label}
                </Button>
              </CommandGroup>
            </React.Fragment>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
