"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function VoteSuccessPage() {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    // Auto-redirect after 30 seconds for security
    const timer = setTimeout(() => {
      handleLogout()
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Error during logout:', error)
      router.push('/login')
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="text-center shadow-lg">
          <CardHeader className="pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Vote Submitted Successfully!
            </CardTitle>
            <CardDescription className="text-slate-600 mt-2">
              Thank you for participating in the democratic process. Your vote has been securely recorded.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-green-800 space-y-2">
                <p className="font-medium">✓ Your ballot has been recorded</p>
                <p className="font-medium">✓ Your vote is secure and confidential</p>
                <p className="font-medium">✓ You have completed the voting process</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> Please keep this confirmation safe. 
                Your vote cannot be changed once submitted.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              <p>Vote submitted on: {new Date().toLocaleString()}</p>
              <p>You will be automatically logged out in 30 seconds for security.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={handleGoHome}
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
              <Button 
                onClick={handleLogout}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout Securely
              </Button>
            </div>

            <div className="text-xs text-slate-400 border-t pt-4">
              <p>PS3Stack Voting System - Secure Electronic Voting</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
