import { Metadata } from 'next'

import { requireSession } from '@/lib/auth/handler'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Dashboard | Vinext Starterkit',
}

export default async function DashboardPage() {
  const auth = await requireSession()
  const user = auth.user

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Welcome Section */}
      <div className="flex items-center gap-4">
        <div className="bg-accent text-accent-foreground flex size-14 items-center justify-center rounded-full text-xl font-semibold">
          {user.fullname.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back, {user.fullname}
          </h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card text-card-foreground ring-foreground/10 flex flex-col gap-2 rounded-xl p-6 shadow-xs ring-1">
          <p className="text-muted-foreground text-sm">Total Posts</p>
          <p className="text-3xl font-semibold">—</p>
        </div>
        <div className="bg-card text-card-foreground ring-foreground/10 flex flex-col gap-2 rounded-xl p-6 shadow-xs ring-1">
          <p className="text-muted-foreground text-sm">Categories</p>
          <p className="text-3xl font-semibold">—</p>
        </div>
        <div className="bg-card text-card-foreground ring-foreground/10 flex flex-col gap-2 rounded-xl p-6 shadow-xs ring-1">
          <p className="text-muted-foreground text-sm">Media</p>
          <p className="text-3xl font-semibold">—</p>
        </div>
        <div className="bg-card text-card-foreground ring-foreground/10 flex flex-col gap-2 rounded-xl p-6 shadow-xs ring-1">
          <p className="text-muted-foreground text-sm">Comments</p>
          <p className="text-3xl font-semibold">—</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card text-card-foreground ring-foreground/10 flex flex-col gap-4 rounded-xl p-6 shadow-xs ring-1">
        <h2 className="text-base font-medium">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/content/posts"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
          >
            New Post
          </a>
          <a
            href="/media/upload"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
          >
            Upload Media
          </a>
          <a
            href="/users"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
          >
            Manage Users
          </a>
          <a
            href="/settings/general"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
          >
            Settings
          </a>
        </div>
      </div>
    </div>
  )
}