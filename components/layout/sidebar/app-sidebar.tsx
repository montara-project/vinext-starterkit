'use client'

import { GalleryVerticalEnd } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { getSidebarMenu } from '@/data/sidebar-menu'
import { AuthSession } from '@/types/auth'
import { Role } from '@/types/menu'

import NavMain from './nav-main'
import NavUser from './nav-user'

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  auth: AuthSession
  role?: Role
}

export default function AppSidebar({ auth, role = 'editor', ...props }: AppSidebarProps) {
  const menu = getSidebarMenu(role)
  const t = useTranslations('sidebar')

  const user = {
    name: auth.user.fullname,
    email: auth.user.email,
    avatar: '',
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-accent text-sidebar-accent-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{t('cmsAdmin')}</span>
                  <span className="">{t('contentManagement')}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain title={t('platform')} items={menu.navMain} />

        {menu.navMarketing.length > 0 && (
          <NavMain title={t('marketing')} items={menu.navMarketing} />
        )}
        {menu.navSetting.length > 0 && <NavMain title={t('settings')} items={menu.navSetting} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
