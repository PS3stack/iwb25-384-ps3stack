"use client"

import React, { createContext, useContext, useState } from 'react'

interface SupportChatContextType {
  isOpen: boolean
  isMinimized: boolean
  toggle: () => void
  minimize: () => void
  maximize: () => void
  open: () => void
  close: () => void
}

const SupportChatContext = createContext<SupportChatContextType | undefined>(undefined)

export function SupportChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const toggle = () => {
    if (isOpen) {
      setIsOpen(false)
      setIsMinimized(false)
    } else {
      setIsOpen(true)
      setIsMinimized(false)
    }
  }

  const minimize = () => {
    setIsMinimized(true)
  }

  const maximize = () => {
    setIsMinimized(false)
  }

  const open = () => {
    setIsOpen(true)
    setIsMinimized(false)
  }

  const close = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const value = {
    isOpen,
    isMinimized,
    toggle,
    minimize,
    maximize,
    open,
    close
  }

  return (
    <SupportChatContext.Provider value={value}>
      {children}
    </SupportChatContext.Provider>
  )
}

export function useSupportChat() {
  const context = useContext(SupportChatContext)
  if (context === undefined) {
    throw new Error('useSupportChat must be used within a SupportChatProvider')
  }
  return context
}
