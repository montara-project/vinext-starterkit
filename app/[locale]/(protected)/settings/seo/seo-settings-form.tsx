'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export function SeoSettingsForm() {
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [ogImageUrl, setOgImageUrl] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [indexing, setIndexing] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('SEO settings saved successfully.')
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="meta-title">Meta Title</FieldLabel>
          <Input
            id="meta-title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Enter a page title"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="meta-description">Meta Description</FieldLabel>
          <Textarea
            id="meta-description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
            placeholder="Enter a meta description"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="og-image-url">OG Image URL</FieldLabel>
          <Input
            id="og-image-url"
            type="url"
            value={ogImageUrl}
            onChange={(e) => setOgImageUrl(e.target.value)}
            placeholder="https://example.com/og-image.png"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="canonical-url">Canonical URL</FieldLabel>
          <Input
            id="canonical-url"
            type="url"
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            placeholder="https://example.com/"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="indexing">Indexing</FieldLabel>
          <div className="flex items-center gap-2">
            <Switch id="indexing" checked={indexing} onCheckedChange={setIndexing} />
            <span className="text-sm text-muted-foreground">
              Allow search engines to index this site
            </span>
          </div>
        </Field>
      </FieldGroup>
      <div>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}
