import { IconCheck } from '@tabler/icons-react'

export type Role = 'editor' | 'admin' | 'viewer'

export type NavSubItem = {
  title: string
  url: string
}

export type NavMainItem = {
  title: string
  url: string
  icon: typeof IconCheck
  isActive?: boolean
  items: NavSubItem[]
}

export type ProjectItem = {
  name: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

export type TeamItem = {
  name: string
  logo: typeof IconCheck
  plan: string
}

export type UserInfo = {
  name: string
  email: string
  avatar: string
}

export type SidebarMenuData = {
  user: UserInfo
  teams: TeamItem[]
  navMain: NavMainItem[]
  navMarketing: NavMainItem[]
  navSetting: NavMainItem[]
}
