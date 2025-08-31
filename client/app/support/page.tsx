"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, MessageCircle, BookOpen, Search, Phone, Mail, Clock, CheckCircle, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { supportAPI } from "@/api/api"
import { useToast } from "@/hooks/use-toast"

interface ChatMessage {
  id: string
  message: string
  is_user: boolean
  timestamp: string
  response?: string
}

export default function SupportCenter() {
  const [supportStats] = useState([
    {
      title: "Response Time",
      value: "< 2 hours",
      description: "Average support response",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Resolution Rate",
      value: "98%",
      description: "Issues resolved successfully",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Tickets",
      value: "12",
      description: "Currently being processed",
      icon: MessageCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Knowledge Base",
      value: "150+",
      description: "Help articles available",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ])

  const [faqCategories] = useState([
    {
      title: "Voter Registration",
      description: "How to register, update information, and check status",
      articles: 15,
      icon: "User",
    },
    {
      title: "Election Process",
      description: "Understanding elections, voting procedures, and results",
      articles: 22,
      icon: "Vote",
    },
    {
      title: "Observer Guidelines",
      description: "Election monitoring, reporting, and observer responsibilities",
      articles: 18,
      icon: "Eye",
    },
    {
      title: "Technical Support",
      description: "System issues, account problems, and troubleshooting",
      articles: 25,
      icon: "Settings",
    },
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const { toast } = useToast()

  // Note: Chat history is managed locally for now
  // Can be enhanced later to fetch from backend if needed

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return
    
    try {
      setIsLoading(true)
      const response = await supportAPI.sendChatMessage({
        message: currentMessage,
        sessionHistory: []
      })
      
      // Add the new message to the chat
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message: currentMessage,
        is_user: true,
        timestamp: new Date().toISOString(),
        response: response.data.reply
      }
      
      setChatMessages(prev => [...prev, newMessage])
      setCurrentMessage("")
      
      toast({
        title: "Message sent",
        description: "Our AI assistant has responded to your question.",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Support Center</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get help with elections, voter registration, and system support. We're here to assist you.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search for help articles, guides, or common questions..."
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {supportStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* AI Chat Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            AI Chat Support
          </CardTitle>
          <CardDescription>Get instant help from our AI assistant powered by OpenAI</CardDescription>
        </CardHeader>
        <CardContent>
          {!showChat ? (
            <div className="text-center py-8">
              <Button onClick={() => setShowChat(true)} className="bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat with AI Assistant
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation with our AI assistant!</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {/* AI Response */}
                      {msg.response && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                            <p className="text-sm">{msg.response}</p>
                            <p className="text-xs text-gray-500 mt-1">AI Assistant</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question here..."
                  className="flex-1 min-h-[40px] max-h-32"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !currentMessage.trim()}
                  className="px-4"
                >
                  {isLoading ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Help Categories
          </CardTitle>
          <CardDescription>Browse help articles by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{category.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{category.description}</p>
                    <Badge variant="secondary" className="mt-2">
                      {category.articles} articles
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Browse
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Alternative ways to reach our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Phone Support</h3>
              <p className="text-sm text-slate-600">+1 (800) 123-4567</p>
              <p className="text-xs text-slate-500">Mon-Fri, 8AM-6PM EST</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Email Support</h3>
              <p className="text-sm text-slate-600">support@elections.gov</p>
              <p className="text-xs text-slate-500">Response within 2 hours</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Live Chat</h3>
              <p className="text-sm text-slate-600">Available 24/7</p>
              <p className="text-xs text-slate-500">Instant responses</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
