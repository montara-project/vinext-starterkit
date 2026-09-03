'use client'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAppForm } from '@/hooks/form'

const fontOptions = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Outfit', value: 'Outfit' },
  { label: 'System', value: 'System' },
]

const layoutOptions = [
  { label: 'Default', value: 'Default' },
  { label: 'Compact', value: 'Compact' },
  { label: 'Wide', value: 'Wide' },
]

const darkModeOptions = [
  { label: 'System', value: 'System' },
  { label: 'Light', value: 'Light' },
  { label: 'Dark', value: 'Dark' },
]

export function AppearanceSettingsForm() {
  const form = useAppForm({
    defaultValues: {
      primaryColor: '#6366f1',
      font: 'Inter',
      layout: 'Default',
      showSidebarIcons: true,
      darkMode: 'System',
    },
    onSubmit: () => {
      toast.success('Appearance settings saved successfully.')
    },
  })

  return (
    <form
      className="flex max-w-xl flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.AppField
          name="primaryColor"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Primary Color</FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  id={field.name}
                  type="color"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-9 w-14"
                />
                <span className="text-muted-foreground text-sm">{field.state.value}</span>
              </div>
            </Field>
          )}
        />

        <form.AppField
          name="font"
          children={(field) => <field.SelectField label="Font" options={fontOptions} />}
        />

        <form.AppField
          name="layout"
          children={(field) => <field.SelectField label="Layout" options={layoutOptions} />}
        />

        <form.AppField
          name="showSidebarIcons"
          children={(field) => (
            <field.SwitchField label="Show Sidebar Icons" onCheckedChange={() => {}} />
          )}
        />

        <form.AppField
          name="darkMode"
          children={(field) => <field.SelectField label="Dark Mode" options={darkModeOptions} />}
        />

        <div>
          <Button type="submit" disabled={form.state.isSubmitting}>
            Save Changes
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
