"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, MessageCircle, BookOpen, Search, Phone, Mail, Clock, CheckCircle } from "lucide-react"

export default function SupportCenter() {
  const supportStats = [
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
  ]

  const faqCategories = [
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
  ]

  const quickActions = [
    {
      title: "Submit Support Ticket",
      description: "Get help with specific issues",
      icon: MessageCircle,
      action: "Create Ticket",
      color: "bg-blue-600",
    },
    {
      title: "Live Chat Support",
      description: "Chat with our support team",
      icon: MessageCircle,
      action: "Start Chat",
      color: "bg-green-600",
    },
    {
      title: "Phone Support",
      description: "Call our support hotline",
      icon: Phone,
      action: "Call Now",
      color: "bg-purple-600",
    },
    {
      title: "Email Support",
      description: "Send us an email",
      icon: Mail,
      action: "Send Email",
      color: "bg-amber-600",
    },
  ]

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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Get Support
          </CardTitle>
          <CardDescription>Choose how you'd like to get help</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{action.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{action.description}</p>
                      </div>
                      <Button size="sm" className="w-full">
                        {action.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
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
