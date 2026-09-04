import {
  IconChartBar,
  IconFileText,
  IconFolder,
  IconLayoutDashboard,
  IconMessage,
  IconPhoto,
  IconSettings,
  IconShield,
  IconStack2,
  IconUsers,
} from '@tabler/icons-react'

import { NavMainItem, Role, SidebarMenuData, TeamItem } from '@/types/menu'

// ── Share sidebar menus ───────────────────────────────────────────

const TEAMS: TeamItem[] = [
  {
    name: 'CMS Admin',
    logo: IconStack2,
    plan: 'Content Management',
  },
]

const NAV_DASHBOARD: NavMainItem = {
  title: 'Dashboard',
  url: '/dashboard',
  icon: IconLayoutDashboard,
  isActive: true,
  items: [],
}

const NAV_CONTENT: NavMainItem = {
  title: 'Content',
  url: '#',
  icon: IconFileText,
  items: [
    {
      title: 'All Posts',
      url: '/content/posts',
    },
    {
      title: 'Pages',
      url: '/content/pages',
    },
    {
      title: 'Categories',
      url: '/content/categories',
    },
    {
      title: 'Tags',
      url: '/content/tags',
    },
  ],
}

const NAV_MEDIA: NavMainItem = {
  title: 'Media',
  url: '#',
  icon: IconPhoto,
  items: [
    {
      title: 'Library',
      url: '/media/library',
    },
    {
      title: 'Upload',
      url: '/media/upload',
    },
  ],
}

const NAV_USERS: NavMainItem = {
  title: 'Users',
  url: '#',
  icon: IconUsers,
  items: [
    {
      title: 'All Users',
      url: '/users',
    },
    {
      title: 'Roles',
      url: '/users/roles',
    },
    {
      title: 'Permissions',
      url: '/users/permissions',
    },
  ],
}

const NAV_COMMENTS: NavMainItem = {
  title: 'Comments',
  url: '/comments',
  icon: IconMessage,
  items: [],
}

const NAV_TAXONOMY: NavMainItem = {
  title: 'Taxonomy',
  url: '#',
  icon: IconFolder,
  items: [
    {
      title: 'Categories',
      url: '/content/categories',
    },
    {
      title: 'Tags',
      url: '/content/tags',
    },
  ],
}

const NAV_ANALYTICS: NavMainItem = {
  title: 'Analytics',
  url: '/analytics',
  icon: IconChartBar,
  items: [],
}

const NAV_ADMINISTRATION: NavMainItem = {
  title: 'Administration',
  url: '#',
  icon: IconShield,
  items: [
    {
      title: 'System Users',
      url: '/users',
    },
    {
      title: 'Roles & Permissions',
      url: '/users/roles',
    },
  ],
}

const NAV_SETTINGS: NavMainItem = {
  title: 'Settings',
  url: '#',
  icon: IconSettings,
  items: [
    {
      title: 'General',
      url: '/settings/general',
    },
    {
      title: 'SEO',
      url: '/settings/seo',
    },
    {
      title: 'Appearance',
      url: '/settings/appearance',
    },
  ],
}

// ── Role-based sidebar menus ───────────────────────────────────────────

const SIDEBAR_MENU_EDITOR: SidebarMenuData = {
  user: {
    name: 'Editor',
    email: 'editor@example.com',
    avatar: '/avatars/editor.jpg',
  },
  teams: TEAMS,
  navMain: [NAV_DASHBOARD, NAV_CONTENT, NAV_MEDIA, NAV_COMMENTS],
  navMarketing: [NAV_TAXONOMY],
  navSetting: [],
}

const SIDEBAR_MENU_ADMIN: SidebarMenuData = {
  user: {
    name: 'Admin',
    email: 'admin@example.com',
    avatar: '/avatars/admin.jpg',
  },
  teams: TEAMS,
  navMain: [NAV_DASHBOARD, NAV_CONTENT, NAV_MEDIA, NAV_USERS, NAV_COMMENTS],
  navMarketing: [NAV_TAXONOMY, NAV_ANALYTICS],
  navSetting: [NAV_ADMINISTRATION, NAV_SETTINGS],
}

const SIDEBAR_MENU_VIEWER: SidebarMenuData = {
  user: {
    name: 'Viewer',
    email: 'viewer@example.com',
    avatar: '/avatars/viewer.jpg',
  },
  teams: TEAMS,
  navMain: [
    NAV_DASHBOARD,
    {
      ...NAV_CONTENT,
      isActive: true,
      items: [
        {
          title: 'All Posts',
          url: '/content/posts',
        },
        {
          title: 'Pages',
          url: '/content/pages',
        },
      ],
    },
    NAV_ANALYTICS,
  ],
  navMarketing: [],
  navSetting: [],
}

// ── Lookup ─────────────────────────────────────────────────────────────

const SIDEBAR_MENUS: Record<Role, SidebarMenuData> = {
  editor: SIDEBAR_MENU_EDITOR,
  admin: SIDEBAR_MENU_ADMIN,
  viewer: SIDEBAR_MENU_VIEWER,
}

export function getSidebarMenu(role: Role): SidebarMenuData {
  return SIDEBAR_MENUS[role]
}
