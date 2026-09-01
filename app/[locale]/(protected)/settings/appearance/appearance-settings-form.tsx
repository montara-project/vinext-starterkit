'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function AppearanceSettingsForm() {
  const [primaryColor, setPrimaryColor] = useState('#6366f1')
  const [font, setFont] = useState('Inter')
  const [layout, setLayout] = useState('Default')
  const [showSidebarIcons, setShowSidebarIcons] = useState(true)
  const [darkMode, setDarkMode] = useState('System')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Appearance settings saved successfully.')
  }

  const selectClassName = cn(
    'border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
  )

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="primary-color">Primary Color</FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              id="primary-color"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-9 w-14"
            />
            <span className="text-sm text-muted-foreground">{primaryColor}</span>
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="font">Font</FieldLabel>
          <select
            id="font"
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className={selectClassName}
          >
            <option value="Inter">Inter</option>
            <option value="Outfit">Outfit</option>
            <option value="System">System</option>
          </select>
        </Field>
        <Field>
          <FieldLabel htmlFor="layout">Layout</FieldLabel>
          <select
            id="layout"
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            className={selectClassName}
          >
            <option value="Default">Default</option>
            <option value="Compact">Compact</option>
            <option value="Wide">Wide</option>
          </select>
        </Field>
        <Field>
          <FieldLabel htmlFor="show-sidebar-icons">Show Sidebar Icons</FieldLabel>
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-sidebar-icons"
              checked={showSidebarIcons}
              onCheckedChange={(checked) => setShowSidebarIcons(checked === true)}
            />
            <span className="text-sm text-muted-foreground">
              Display icons next to navigation items
            </span>
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="dark-mode">Dark Mode</FieldLabel>
          <select
            id="dark-mode"
            value={darkMode}
            onChange={(e) => setDarkMode(e.target.value)}
            className={selectClassName}
          >
            <option value="System">System</option>
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </Field>
      </FieldGroup>
      <div>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}
