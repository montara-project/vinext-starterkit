'use client'

import { Slider as SliderPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

function Slider({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn('relative flex h-4 w-full touch-none items-center select-none', className)}
      {...props}
    >
      <SliderPrimitive.Track className="bg-accent relative h-1.5 w-full overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      {children}
    </SliderPrimitive.Root>
  )
}

function SliderThumb({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Thumb>) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(
        'border-primary bg-primary-foreground box-content block size-4 shrink-0 cursor-pointer rounded-full border-[2px] shadow-xs shadow-black/5 outline-hidden focus:outline-hidden',
        className
      )}
      {...props}
    />
  )
}

export { Slider, SliderThumb }
