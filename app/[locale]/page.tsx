import { redirect } from '@/i18n/navigation'

export default function HomeRedirect() {
  return redirect({ href: '/home', locale: 'en' })
}
