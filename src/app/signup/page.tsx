"use client"

import { useState } from "react"
import { registerUser } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await registerUser(formData)
    
    if (result.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success("Account created! Please sign in.")
      router.push("/api/auth/signin")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md p-8 bg-zinc-900 border-zinc-800">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
          <p className="text-zinc-400">Sign up to save and share your countdowns</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="John Doe" 
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="you@example.com"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/api/auth/signin" className="text-white hover:underline">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  )
}
