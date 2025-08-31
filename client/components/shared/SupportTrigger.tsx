"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, HelpCircle } from "lucide-react"
import { useSupportChat } from "@/contexts/SupportChatContext"

interface SupportTriggerProps {
  variant?: "button" | "link"
  size?: "sm" | "md" | "lg"
  className?: string
  children?: React.ReactNode
}

export default function SupportTrigger({ 
  variant = "button", 
  size = "md", 
  className = "",
  children 
}: SupportTriggerProps) {
  const { open } = useSupportChat()

  if (variant === "link") {
    return (
      <button
        onClick={open}
        className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors underline ${className}`}
      >
        <HelpCircle className="w-4 h-4" />
        {children || "Get Support"}
      </button>
    )
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-lg"
  }

  const buttonSize = size === "md" ? "default" : size as "sm" | "lg"

  return (
    <Button
      onClick={open}
      variant="outline"
      size={buttonSize}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      {children || "Support"}
    </Button>
  )
}
