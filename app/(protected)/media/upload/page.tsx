import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { MediaUpload } from './media-upload'

export const metadata: Metadata = {
  ...META,
  title: 'Upload Media | Vinext Starterkit',
}

export default function MediaUploadPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Upload Media</h1>
        <p className="text-muted-foreground text-sm">Upload new media files to the library</p>
      </div>
      <MediaUpload />
    </div>
  )
}