import { TanStackDevtools } from '@tanstack/react-devtools'
import { FormDevtoolsPanel } from '@tanstack/react-form-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { PropsWithChildren } from 'react'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import ReactQueryProvider from './react-query'
import ThemeProvider from './themes'

export default function DecorationProvider({ children }: PropsWithChildren) {
  const isProd = process.env.NODE_ENV === 'production'

  return (
    <NuqsAdapter>
      <ReactQueryProvider>
        <ThemeProvider>
          <TooltipProvider>
            {children}

            {!isProd && (
              <TanStackDevtools
                config={{
                  panelLocation: 'bottom',
                  position: 'bottom-right',
                }}
                plugins={[
                  { name: 'TanStack Form', render: <FormDevtoolsPanel /> },
                  { name: 'TanStack Query', render: <ReactQueryDevtoolsPanel /> },
                ]}
              />
            )}
            <Toaster position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </NuqsAdapter>
  )
}
