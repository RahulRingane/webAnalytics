import { LayoutDashboard, FolderGit2, Settings } from "lucide-react";

interface SidebarLinkItem {
  href: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  iconColor: string;
  pattern: RegExp;
}

const sidebarLinks: SidebarLinkItem[] = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    iconColor: "#5B98FF",
    pattern: /^\/dashboard/,
  },
  {
    href: "/projects",
    icon: FolderGit2,
    label: "Projects",
    iconColor: "#Fc8c14",
    pattern: /^\/projects/,
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
    iconColor: "#54ffff",
    pattern: /^\/settings/,
  },
];

export default sidebarLinks;