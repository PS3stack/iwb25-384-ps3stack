import { FileText, Home, Upload, Database, CheckSquare, MapPin, Users } from "lucide-react"

export const fieldStaffSidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/field-staff",
  },
  {
    id: "census-selection",
    label: "Active Census",
    icon: FileText,
    href: "/field-staff/census",
  },
  {
    id: "households",
    label: "Household Management",
    icon: Users,
    href: "/field-staff/households",
    children: [
      {
        id: "assigned-households",
        label: "Assigned Households",
        icon: Database,
        href: "/field-staff/households/assigned",
      },
      {
        id: "manage-households",
        label: "Manage Households",
        icon: Home,
        href: "/field-staff/households/manage",
      },
    ],
  },
  {
    id: "data-submission",
    label: "Data Submission",
    icon: Upload,
    href: "/field-staff/submission",
    children: [
      {
        id: "submit-data",
        label: "Submit Data",
        icon: CheckSquare,
        href: "/field-staff/submission/submit",
      },
      {
        id: "submission-history",
        label: "Submission History",
        icon: Database,
        href: "/field-staff/submission/history",
      },
    ],
  },
  {
    id: "areas",
    label: "My Areas",
    icon: MapPin,
    href: "/field-staff/areas",
  },
]
