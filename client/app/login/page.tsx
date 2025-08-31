"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password || !role) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      // Map role to login endpoint
      let loginEndpoint = ''
      let redirectPath = ''
      let roleId = 0
      
      switch (role) {
        case 'admin':
          loginEndpoint = 'api/auth/admin/login'
          redirectPath = '/admin'
          roleId = 1
          break
        case 'observer':
          loginEndpoint = 'api/auth/observer/login'
          redirectPath = '/observer'
          roleId = 2
          break
        case 'field_staff':
          loginEndpoint = 'api/auth/field_staff/login'
          redirectPath = '/field-staff'
          roleId = 3
          break
        case 'polling_staff':
          loginEndpoint = 'api/auth/polling_staff/login'
          redirectPath = '/support'
          roleId = 4
          break
        case 'voter':
          loginEndpoint = 'api/auth/voter/login'
          redirectPath = '/voter/ballot'
          roleId = 5
          break
        default:
          setError('Invalid role selected')
          setLoading(false)
          return
      }

      try {
        const response = await fetch(`http://localhost:8080/${loginEndpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, role_id: roleId }),
          credentials: 'include', // Include cookies
        })

        if (response.ok) {
          const data = await response.json()
          
          // Create user object from response data
          const user = {
            id: 1, // Default ID for now
            name: data.userEmail?.split('@')[0] || 'User', // Extract name from email
            email: data.userEmail || email,
            role: data.role || role,
            role_id: roleId
          }
          
          login(user, data.token || 'session-token', data.role || role)
          router.push(redirectPath)
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'Login failed')
        }
      } catch (networkError: any) {
        // If backend is not available, provide demo login for voter role
        if ((networkError.code === 'ECONNREFUSED' || networkError.message?.includes('fetch')) && 
            role === 'voter' && 
            (email === 'voter1@test.com' || email === 'voter2@test.com' || email === 'voter3@test.com') && 
            password === 'password123') {
          
          console.log('Backend not available, using demo login for voter')
          
          // Create demo user object
          const user = {
            id: 1,
            name: email.split('@')[0],
            email: email,
            role: 'voter',
            role_id: 5
          }
          
          // Create a demo token
          const demoToken = btoa(JSON.stringify({
            sub: email,
            role_id: 5,
            role: 'voter',
            exp: Date.now() + 3600000 // 1 hour
          }))
          
          login(user, demoToken, 'voter')
          router.push('/voter/ballot')
        } else {
          throw networkError // Re-throw if not a demo case
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Election System Login
          </CardTitle>
          <CardDescription className="text-center">
            Choose your role and enter your credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="voter">Voter</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="observer">Observer</SelectItem>
                  <SelectItem value="field_staff">Field Staff</SelectItem>
                  <SelectItem value="polling_staff">Polling Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 border-t pt-6">
            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-2">Demo Accounts:</h4>
              <div className="space-y-1 text-xs">
                <p><strong>Voter:</strong> voter1@test.com / password123</p>
                <p><strong>Admin:</strong> admin@test.com / password123</p>
                <p><strong>Observer:</strong> observer@test.com / password123</p>
                <p><strong>Field Staff:</strong> field@test.com / password123</p>
                <p><strong>Polling Staff:</strong> polling@test.com / password123</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
