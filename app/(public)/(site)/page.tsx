import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

const links = [
  {
    href: 'https://github.com/cloudflare/vinext',
    label: 'vinext',
  },
  {
    href: 'https://developers.cloudflare.com/workers/',
    label: 'Workers',
  },
]

export const metadata: Metadata = {
  ...META,
  title: 'Home | Vinext Starterkit',
}

export const revalidate = 300

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <section className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            vinext + Cloudflare Workers
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            Build Next.js-style apps with Vite and deploy them to the edge.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            This App Router project is wired for vinext, Tailwind CSS, and Cloudflare Workers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold">Develop</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Run the vinext dev server locally.
            </p>
            <code className="mt-4 block rounded bg-muted px-3 py-2 text-sm">pnpm run dev</code>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold">Build</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create Worker-ready production output.
            </p>
            <code className="mt-4 block rounded bg-muted px-3 py-2 text-sm">
              pnpm run build
            </code>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold">Deploy</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Ship the generated Worker with Wrangler.
            </p>
            <code className="mt-4 block rounded bg-muted px-3 py-2 text-sm">
              pnpm run deploy
            </code>
          </div>
        </div>

        <nav className="flex flex-wrap gap-3">
          {links.map((link) => (
            <a
              className="rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
              href={link.href}
              key={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
          <a
            className="rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            href="/api/hello"
          >
            API route
          </a>
        </nav>
      </section>
    </main>
  )
}
