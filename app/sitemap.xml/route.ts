import { env } from '@/config/env'
import { routing } from '@/i18n/routing'

export async function GET() {
  const baseUrl = env.BETTER_AUTH_URL || 'https://example.com'
  const cleanBase = baseUrl.replace(/\/$/, '')
  const now = new Date().toISOString()

  const paths = ['', '/privacy-policy', '/terms-of-service']
  const urls = routing.locales.flatMap((locale) =>
    paths.map((path) => {
      const url = `${cleanBase}/${locale}${path}`
      const alternates = [
        ...routing.locales.map(
          (loc) =>
            `    <xhtml:link rel="alternate" hreflang="${loc}" href="${cleanBase}/${loc}${path}" />`
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanBase}${path}" />`,
      ].join('\n')

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternates}
  </url>`
    })
  )

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
