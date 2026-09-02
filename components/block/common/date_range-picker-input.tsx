'use client'

import { IconCalendar } from '@tabler/icons-react'
import { addDays, format } from 'date-fns'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DateRangePickerInputProps {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  placeholder?: string
  disabledPast?: boolean
}

export default function DateRangePickerInput({
  date: initialDate,
  onDateChange,
  placeholder,
  disabledPast = false,
}: DateRangePickerInputProps) {
  const today = new Date()
  const defaultDate: DateRange = {
    from: today,
    to: addDays(today, 7),
  }

  const [date, setDate] = useState<DateRange | undefined>(initialDate || defaultDate)

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleApply = () => {
    if (date) {
      setDate(date)
    }
    setIsPopoverOpen(false)
  }

  const handleReset = () => {
    setDate(defaultDate)
    setIsPopoverOpen(false)
  }

  const handleSelect = (selected: DateRange | undefined) => {
    const newDate = {
      from: selected?.from || undefined,
      to: selected?.to || undefined,
    }

    setDate(newDate)
    onDateChange(newDate)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          mode="input"
          placeholder={!date?.from && !date?.to}
          className="w-[250px]"
        >
          <IconCalendar />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
              </>
            ) : (
              format(date.from, 'LLL dd, y')
            )
          ) : (
            <span>{placeholder || `Pick a date range`}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={date?.from}
          showOutsideDays={false}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={disabledPast ? { before: today } : undefined}
        />
        <div className="border-border flex items-center justify-end gap-1.5 border-t p-3">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
