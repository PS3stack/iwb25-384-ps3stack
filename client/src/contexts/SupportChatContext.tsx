"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SupportChatContextType {
  isOpen: boolean
  isMinimized: boolean
  open: () => void
  close: () => void
  minimize: () => void
  maximize: () => void
  toggle: () => void
}

const SupportChatContext = createContext<SupportChatContextType | undefined>(undefined)

export function useSupportChat() {
  const context = useContext(SupportChatContext)
  if (context === undefined) {
    throw new Error('useSupportChat must be used within a SupportChatProvider')
  }
  return context
}

interface SupportChatProviderProps {
  children: ReactNode
}

export function SupportChatProvider({ children }: SupportChatProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const open = () => {
    setIsOpen(true)
    setIsMinimized(false)
  }

  const close = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const minimize = () => {
    setIsMinimized(true)
  }

  const maximize = () => {
    setIsMinimized(false)
  }

  const toggle = () => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }

  const value = {
    isOpen,
    isMinimized,
    open,
    close,
    minimize,
    maximize,
    toggle
  }

  return (
    <SupportChatContext.Provider value={value}>
      {children}
    </SupportChatContext.Provider>
  )
}
