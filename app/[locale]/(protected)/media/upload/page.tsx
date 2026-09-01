import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

import { MediaUpload } from './media-upload'

export const metadata: Metadata = {
  ...META,
  title: 'Upload Media | Vinext Starterkit',
}

export default async function MediaUploadPage() {
  const t = await getTranslations('pages')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('mediaUpload.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('mediaUpload.subtitle')}</p>
      </div>
      <MediaUpload />
    </div>
  )
}