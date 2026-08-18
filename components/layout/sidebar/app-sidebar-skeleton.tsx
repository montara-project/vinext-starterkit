'use client'

import React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

function NavSkeletonGroup({ count = 5 }: { count?: number }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Skeleton className="h-3 w-20 bg-neutral-400" />
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {Array.from({ length: count }).map((_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton>
                <Skeleton className="h-4 w-4 shrink-0 rounded bg-neutral-400" />
                <Skeleton className="h-3 w-38 bg-neutral-400 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default function AppSidebarSkeleton(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Skeleton className="h-6 w-6 shrink-0 rounded bg-neutral-400" />
              <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
                <Skeleton className="h-3 w-16 bg-neutral-400" />
                <Skeleton className="h-2.5 w-20 bg-neutral-400" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavSkeletonGroup count={5} />
        <NavSkeletonGroup count={3} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full bg-neutral-400" />
              <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
                <Skeleton className="h-3 w-24 bg-neutral-400" />
                <Skeleton className="h-2.5 w-32 bg-neutral-400" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
