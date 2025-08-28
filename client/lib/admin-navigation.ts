import { Vote, Eye, Users, UserCheck, BarChart3, FileText, Plus, Upload, Monitor, Shield, Database } from "lucide-react"

export const adminSidebarItems = [
  {
    id: "elections",
    label: "Election Management",
    icon: Vote,
    href: "/admin/elections",
    children: [
      {
        id: "elections-list",
        label: "All Elections",
        icon: Vote,
        href: "/admin/elections",
      },
      {
        id: "elections-create",
        label: "Create Election",
        icon: Plus,
        href: "/admin/elections/create",
      },
    ],
  },
  {
    id: "observers",
    label: "Observer Management",
    icon: Eye,
    href: "/admin/observers",
    children: [
      {
        id: "observers-list",
        label: "All Observers",
        icon: Eye,
        href: "/admin/observers",
      },
      {
        id: "observers-add",
        label: "Add Observer",
        icon: Plus,
        href: "/admin/observers/add",
      },
      {
        id: "areas",
        label: "Area Management",
        icon: Database,
        href: "/admin/observers/areas",
      },
    ],
  },
  {
    id: "candidates",
    label: "Candidate Management",
    icon: UserCheck,
    href: "/admin/candidates",
    children: [
      {
        id: "candidates-list",
        label: "All Candidates",
        icon: UserCheck,
        href: "/admin/candidates",
      },
      {
        id: "qualifications",
        label: "Qualifications",
        icon: Shield,
        href: "/admin/candidates/qualifications",
      },
    ],
  },
  {
    id: "voters",
    label: "Voter Management",
    icon: Users,
    href: "/admin/voters",
    children: [
      {
        id: "voters-list",
        label: "All Voters",
        icon: Users,
        href: "/admin/voters",
      },
      {
        id: "voters-add",
        label: "Add Voter",
        icon: Plus,
        href: "/admin/voters/add",
      },
      {
        id: "voters-import",
        label: "Import CSV",
        icon: Upload,
        href: "/admin/voters/import",
      },
    ],
  },
  {
    id: "monitoring",
    label: "System Monitoring",
    icon: Monitor,
    href: "/admin/monitoring",
    children: [
      {
        id: "turnout",
        label: "Live Turnout",
        icon: BarChart3,
        href: "/admin/monitoring/turnout",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        href: "/admin/analytics", // Updated analytics path to be more prominent
      },
      {
        id: "audit",
        label: "Audit Logs",
        icon: FileText,
        href: "/admin/monitoring/audit",
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics & Reports",
    icon: BarChart3,
    href: "/admin/analytics",
    children: [
      {
        id: "analytics-dashboard",
        label: "Analytics Dashboard",
        icon: BarChart3,
        href: "/admin/analytics",
      },
      {
        id: "election-analytics",
        label: "Election Analytics",
        icon: Vote,
        href: "/admin/analytics/elections",
      },
      {
        id: "voter-analytics",
        label: "Voter Analytics",
        icon: Users,
        href: "/admin/analytics/voters",
      },
      {
        id: "reports",
        label: "Generate Reports",
        icon: FileText,
        href: "/admin/analytics/reports",
      },
    ],
  },
  {
    id: "results",
    label: "Results",
    icon: FileText,
    href: "/admin/results",
  },
]
