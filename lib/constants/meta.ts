import { Metadata } from 'next'

export const META_URL = 'https://example.com'
export const META_TITLE = `CMS Admin - Content Management System`
export const META_DESCRIPTION = `Powerful and intuitive content management system for creating, managing, and publishing digital content. Streamline your workflow with our modern CMS platform.`
export const META_IMAGE = '/static/images/brand-logo.png'
export const META_KEYWORDS = `cms, content management, admin panel, dashboard, publishing`

const SITE_NAME = 'CMS Admin'

export const META: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  keywords: META_KEYWORDS,
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: META_URL,
    siteName: SITE_NAME,
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
    creator: SITE_NAME,
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
} as const
