import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { MediaLibrary } from './media-library'

export const metadata: Metadata = {
  ...META,
  title: 'Media Library | Vinext Starterkit',
}

export default function MediaLibraryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Media Library</h1>
        <p className="text-muted-foreground text-sm">Browse and manage uploaded media</p>
      </div>
      <MediaLibrary />
    </div>
  )
}