'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export function GeneralSettingsForm() {
  const [siteName, setSiteName] = useState('My Site')
  const [siteDescription, setSiteDescription] = useState('')
  const [siteUrl, setSiteUrl] = useState('https://example.com')
  const [contactEmail, setContactEmail] = useState('')
  const [language, setLanguage] = useState('en')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('General settings saved successfully.')
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="site-name">Site Name</FieldLabel>
          <Input
            id="site-name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="site-description">Site Description</FieldLabel>
          <Textarea
            id="site-description"
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            rows={3}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="site-url">Site URL</FieldLabel>
          <Input
            id="site-url"
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-email">Contact Email</FieldLabel>
          <Input
            id="contact-email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="language">Default Language</FieldLabel>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={cn(
              'border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <option value="en">English</option>
            <option value="id">Indonesian</option>
          </select>
        </Field>
      </FieldGroup>
      <div>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}