"use client"

import { Button } from "@/components/ui/button"
import { Share2, BookmarkPlus, Home, Check } from "lucide-react"
import { useState } from "react"
import { saveTimer } from "@/actions/timer"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { usePiPWidget } from "@/hooks/usePiPWidget"
import { createPortal } from "react-dom"
import { ExternalLink } from "lucide-react"
import { CountdownDisplay } from "./CountdownDisplay"

interface TimerData {
  id: string
  title: string
  type: string
  targetDate: Date | null
  durationSeconds: number | null
  color: string
  font: string
}

export function TimerActionBar({ timer }: { timer: TimerData }) {
  const router = useRouter()
  const [isCopied, setIsCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { isSupported, pipWindow, requestPiP, closePiP } = usePiPWidget()

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsCopied(true)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await saveTimer(timer.id)
      if (result && result.error) {
        toast.error(result.error)
      } else {
        toast.success("Timer saved! You will be notified when it ends.")
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to save timer")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-zinc-900/80 backdrop-blur-md px-6 py-4 rounded-full border border-white/10 z-20">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-white hover:bg-white/20">
          <Home className="w-5 h-5" />
        </Button>
        
        <div className="w-px h-8 bg-white/20 mx-2" />

        <Button variant="ghost" className="text-white hover:bg-white/20" onClick={handleShare}>
          {isCopied ? <Check className="w-5 h-5 mr-2" /> : <Share2 className="w-5 h-5 mr-2" />}
          {isCopied ? "Copied" : "Share"}
        </Button>

        {isSupported && (
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20" 
            onClick={() => {
              if (pipWindow) {
                closePiP()
              } else {
                requestPiP(400, 250)
              }
            }}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            {pipWindow ? "Close Widget" : "Pop out"}
          </Button>
        )}

        <Button onClick={handleSave} disabled={isSaving} className="bg-white text-black hover:bg-zinc-200">
          <BookmarkPlus className="w-5 h-5 mr-2" />
          Save
        </Button>
      </div>

      {pipWindow && createPortal(
        <div 
          className="h-screen w-screen flex flex-col items-center justify-center bg-[#111] overflow-hidden"
          style={{
            color: timer.color,
            fontFamily: timer.font === 'sans' ? 'sans-serif' : 'serif'
          }}
        >
          <div className="w-full flex-1 flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold tracking-tight mb-4 text-center">
              {timer.title}
            </h1>
            <div className="scale-50 sm:scale-75 origin-center">
              <CountdownDisplay 
                targetDate={timer.targetDate}
                durationSeconds={timer.durationSeconds}
                type={timer.type as "DATE" | "CONSTANT"}
              />
            </div>
          </div>
        </div>,
        pipWindow.document.body
      )}
    </>
  )
}
