"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { MessageCircle, HelpCircle } from "lucide-react"
import { useSupportChat } from "@/contexts/SupportChatContext"

export default function FloatingSupportButton() {
  const { toggle, isOpen } = useSupportChat()

  if (isOpen) return null

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Button
        onClick={toggle}
        size="lg"
        className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
          />
        </div>
      </Button>
    </motion.div>
  )
}
