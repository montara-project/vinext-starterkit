'use client'

import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Link, usePathname } from '@/i18n/navigation'
import { type NavMainItem } from '@/types/menu'

const SIDEBAR_KEYS: Record<string, string> = {
  Dashboard: 'dashboard',
  Content: 'content',
  'All Posts': 'allPosts',
  Pages: 'pages',
  Categories: 'categories',
  Tags: 'tags',
  Media: 'media',
  Library: 'library',
  Upload: 'upload',
  Users: 'users',
  'All Users': 'allUsers',
  Roles: 'roles',
  Permissions: 'permissions',
  Comments: 'comments',
  'All Comments': 'allComments',
  Pending: 'pending',
  Spam: 'spam',
  Taxonomy: 'taxonomy',
  Analytics: 'analytics',
  Overview: 'overview',
  Traffic: 'traffic',
  'Content Performance': 'contentPerformance',
  Administration: 'administration',
  'System Users': 'systemUsers',
  'Roles & Permissions': 'rolesPermissions',
  'Activity Log': 'activityLog',
  Settings: 'settings',
  General: 'general',
  SEO: 'seo',
  Appearance: 'appearance',
}

type NavMainProps = {
  title: string
  items: NavMainItem[]
}

export default function NavMain({ title, items }: NavMainProps) {
  const pathname = usePathname()
  const t = useTranslations('sidebar')

  const renderSidebarMenu = (item: NavMainItem) => {
    if (item.items.length === 0) {
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            tooltip={t(SIDEBAR_KEYS[item.title] ?? item.title)}
            asChild
            isActive={pathname.includes(item.url)}
          >
            <Link href={item.url}>
              {item.icon && <item.icon />}
              <span>{t(SIDEBAR_KEYS[item.title] ?? item.title)}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

    if (item.items.length > 0) {
      return (
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={item.isActive || item.items.some((sub) => pathname.includes(sub.url))}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={t(SIDEBAR_KEYS[item.title] ?? item.title)}
                isActive={item.items.some((sub) => pathname.includes(sub.url))}
              >
                {item.icon && <item.icon />}
                <span>{t(SIDEBAR_KEYS[item.title] ?? item.title)}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild isActive={pathname.includes(subItem.url)}>
                      <Link href={subItem.url}>
                        {subItem.icon && <subItem.icon />}
                        <span>{t(SIDEBAR_KEYS[subItem.title] ?? subItem.title)}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      )
    }

    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>{items.map((item) => renderSidebarMenu(item))}</SidebarMenu>
    </SidebarGroup>
  )
}
