'use client'

import { FileText, Image as ImageIcon, MessageSquare, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stats = [
  { label: 'Total Posts', icon: FileText },
  { label: 'Total Users', icon: Users },
  { label: 'Total Comments', icon: MessageSquare },
  { label: 'Total Media', icon: ImageIcon },
]

export function AnalyticsDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, icon: Icon }) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Icon className="text-muted-foreground size-4" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">—</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Chart visualizations are coming in a future phase. This dashboard currently shows
            placeholder values for your site metrics.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}