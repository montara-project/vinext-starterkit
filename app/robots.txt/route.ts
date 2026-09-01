import { env } from '@/config/env'

export async function GET() {
  const baseUrl = env.BETTER_AUTH_URL || 'https://example.com'
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /sign-in
Disallow: /sign-up
Disallow: /*/dashboard
Disallow: /*/content
Disallow: /*/media
Disallow: /*/users
Disallow: /*/comments
Disallow: /*/analytics
Disallow: /*/settings

Sitemap: ${baseUrl}/sitemap.xml
`
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
