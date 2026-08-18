'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
import { type NavMainItem } from '@/types/menu'

type NavMainProps = {
  title: string
  items: NavMainItem[]
}

export default function NavMain({ title, items }: NavMainProps) {
  const pathname = usePathname()

  const renderSidebarMenu = (item: NavMainItem) => {
    if (item.items.length === 0) {
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton tooltip={item.title} asChild isActive={pathname.includes(item.url)}>
            <Link href={item.url}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
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
                tooltip={item.title}
                isActive={item.items.some((sub) => pathname.includes(sub.url))}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
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
                        <span>{subItem.title}</span>
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
