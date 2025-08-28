import { FileText, Users, UserPlus, BarChart3, Plus, Upload, Monitor, Database, Download } from "lucide-react"

export const censusSidebarItems = [
  {
    id: "projects",
    label: "Census Projects",
    icon: FileText,
    href: "/census/projects",
    children: [
      {
        id: "projects-list",
        label: "All Projects",
        icon: FileText,
        href: "/census/projects",
      },
      {
        id: "projects-create",
        label: "Create Project",
        icon: Plus,
        href: "/census/projects/create",
      },
    ],
  },
  {
    id: "collectors",
    label: "Data Collectors",
    icon: Users,
    href: "/census/collectors",
    children: [
      {
        id: "collectors-list",
        label: "All Collectors",
        icon: Users,
        href: "/census/collectors",
      },
      {
        id: "collectors-add",
        label: "Add Collector",
        icon: UserPlus,
        href: "/census/collectors/add",
      },
      {
        id: "assignments",
        label: "Assignments",
        icon: Database,
        href: "/census/collectors/assignments",
      },
    ],
  },
  {
    id: "data",
    label: "Data Management",
    icon: Upload,
    href: "/census/data",
    children: [
      {
        id: "data-import",
        label: "Import Data",
        icon: Upload,
        href: "/census/data/import",
      },
      {
        id: "data-export",
        label: "Export Data",
        icon: Download,
        href: "/census/data/export",
      },
    ],
  },
  {
    id: "monitoring",
    label: "Monitoring",
    icon: Monitor,
    href: "/census/monitoring",
    children: [
      {
        id: "dashboard",
        label: "Live Dashboard",
        icon: BarChart3,
        href: "/census/monitoring/dashboard",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        href: "/census/analytics", // Updated analytics path for census
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics & Reports",
    icon: BarChart3,
    href: "/census/analytics",
    children: [
      {
        id: "analytics-dashboard",
        label: "Analytics Dashboard",
        icon: BarChart3,
        href: "/census/analytics",
      },
      {
        id: "progress-analytics",
        label: "Progress Analytics",
        icon: Database,
        href: "/census/analytics/progress",
      },
      {
        id: "collector-analytics",
        label: "Collector Performance",
        icon: Users,
        href: "/census/analytics/collectors",
      },
    ],
  },
  {
    id: "results",
    label: "Results",
    icon: FileText,
    href: "/census/results",
  },
]
