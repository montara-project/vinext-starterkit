import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { PropsWithChildren } from 'react'

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider
      storageKey="nextjs-theme"
      defaultTheme="dark"
      attribute="class"
      disableTransitionOnChange
      enableColorScheme
      enableSystem
    >
      {children}
    </NextThemesProvider>
  )
}
