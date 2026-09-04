import { Metadata } from 'next'

import { env } from '@/config/env'

export const META_URL = env.BETTER_AUTH_URL || 'https://example.com'
export const META_TITLE = 'CMS Admin'
export const META_DESCRIPTION =
  'Powerful and intuitive content management system for creating, managing, and publishing digital content.'
export const META_IMAGE = '/static/images/brand-logo.png'
export const META_KEYWORDS = 'cms, content management, admin panel, dashboard, publishing'

export const META: Metadata = {
  metadataBase: new URL(META_URL),
  title: { default: META_TITLE, template: `%s | ${META_TITLE}` },
  description: META_DESCRIPTION,
  keywords: META_KEYWORDS,
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: META_URL,
    siteName: META_TITLE,
    images: [
      {
        url: META_IMAGE,
        width: 1200,
        height: 630,
        alt: META_TITLE,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: META_TITLE,
    description: META_DESCRIPTION,
    site: META_URL,
    creator: META_TITLE,
    images: [META_IMAGE],
  },
  icons: {
    icon: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
    shortcut: '/favicon/favicon.ico',
    other: {
      rel: 'shortcut icon',
      url: '/favicon/favicon.ico',
    },
  },
}
