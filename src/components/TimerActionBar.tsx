"use client"

import { Button } from "@/components/ui/button"
import { Share2, BookmarkPlus, Home, Check } from "lucide-react"
import { useState } from "react"
import { saveTimer } from "@/actions/timer"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function TimerActionBar({ timer }: { timer: any }) {
  const router = useRouter()
  const [isCopied, setIsCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsCopied(true)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveTimer(timer.id)
      toast.success("Timer saved! You will be notified when it ends.")
    } catch (e: any) {
      toast.error(e.message || "Failed to save timer")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-zinc-900/80 backdrop-blur-md px-6 py-4 rounded-full border border-white/10 z-20">
      <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-white hover:bg-white/20">
        <Home className="w-5 h-5" />
      </Button>
      
      <div className="w-px h-8 bg-white/20 mx-2" />

      <Button variant="ghost" className="text-white hover:bg-white/20" onClick={handleShare}>
        {isCopied ? <Check className="w-5 h-5 mr-2" /> : <Share2 className="w-5 h-5 mr-2" />}
        {isCopied ? "Copied" : "Share"}
      </Button>

      <Button onClick={handleSave} disabled={isSaving} className="bg-white text-black hover:bg-zinc-200">
        <BookmarkPlus className="w-5 h-5 mr-2" />
        Save
      </Button>
    </div>
  )
}
