"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createTimer, CreateTimerInput } from "@/actions/timer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

const PRESELECTED_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1920&auto=format&fit=crop", // starry night
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop", // mountains
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1920&auto=format&fit=crop", // dark texture
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1920&auto=format&fit=crop", // abstract color
  "" // no background
]

export default function CreateTimerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [title, setTitle] = useState("My Awesome Timer")
  const [type, setType] = useState<"DATE" | "CONSTANT">("DATE")
  const [targetDate, setTargetDate] = useState("")
  const [targetTime, setTargetTime] = useState("")
  const [duration, setDuration] = useState("300") // 5 minutes default
  
  const [font, setFont] = useState("sans")
  const [color, setColor] = useState("#ffffff")
  const [bgImage, setBgImage] = useState(PRESELECTED_BACKGROUNDS[0])
  const [isPublic, setIsPublic] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let finalDate: Date | undefined
      let finalDuration: number | undefined
      
      if (type === "DATE") {
        if (!targetDate || !targetTime) {
          toast.error("Please set a date and time")
          setLoading(false)
          return
        }
        finalDate = new Date(`${targetDate}T${targetTime}`)
      } else {
        finalDuration = parseInt(duration)
        if (isNaN(finalDuration) || finalDuration <= 0) {
          toast.error("Please set a valid duration")
          setLoading(false)
          return
        }
      }

      const input: CreateTimerInput = {
        title,
        type,
        targetDate: finalDate,
        durationSeconds: finalDuration,
        font,
        color,
        bgImage: bgImage || undefined,
        visibility: isPublic ? "PUBLIC" : "UNLISTED"
      }
      
      const timer = await createTimer(input)
      
      // Guest mode - store in local storage if not logged in
      const guestTimers = JSON.parse(localStorage.getItem("guestTimers") || "[]")
      guestTimers.push(timer.id)
      localStorage.setItem("guestTimers", JSON.stringify(guestTimers))
      
      toast.success("Timer created!")
      router.push(`/timer/${timer.id}`)
    } catch (error) {
      toast.error("Failed to create timer")
    } finally {
      setLoading(false)
    }
  }

  // Live Preview calculate dummy display
  const renderPreviewDisplay = () => {
    if (type === "DATE") return "10d 05h 20m 15s"
    const mins = Math.floor(parseInt(duration || "0") / 60)
    const secs = parseInt(duration || "0") % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl mt-10">
      <h1 className="text-3xl font-bold mb-8">Create New Timer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Controls */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <Tabs value={type} onValueChange={(v) => setType(v as "DATE"|"CONSTANT")}>
              <TabsList className="w-full">
                <TabsTrigger value="DATE" className="flex-1">Specific Date</TabsTrigger>
                <TabsTrigger value="CONSTANT" className="flex-1">Duration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="DATE" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" value={targetTime} onChange={e => setTargetTime(e.target.value)} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="CONSTANT" className="pt-4">
                <div className="space-y-2">
                  <Label>Duration (Seconds)</Label>
                  <Input type="number" min="1" value={duration} onChange={e => setDuration(e.target.value)} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Customization</h3>
              
              <div className="space-y-2">
                <Label>Text Color</Label>
                <Input type="color" className="h-12 w-full cursor-pointer" value={color} onChange={e => setColor(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Background Image</Label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESELECTED_BACKGROUNDS.map((bg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBgImage(bg)}
                      className={`h-16 rounded-md border-2 bg-cover bg-center ${bgImage === bg ? 'border-primary' : 'border-transparent'}`}
                      style={{ backgroundImage: bg ? `url(\${bg})` : 'none', backgroundColor: bg ? 'transparent' : '#333' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t">
              <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
              <Label htmlFor="public">Make Public (Show on Homepage)</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Timer"}
            </Button>
          </form>
        </Card>

        {/* Live Preview */}
        <div className="flex flex-col space-y-4">
          <Label className="text-muted-foreground text-sm uppercase tracking-widest">Live Preview</Label>
          <div 
            className="flex-1 rounded-xl shadow-2xl flex flex-col items-center justify-center p-8 bg-cover bg-center bg-zinc-900 overflow-hidden relative"
            style={{ 
              backgroundImage: bgImage ? `url(\${bgImage})` : 'none',
              color: color,
              fontFamily: font === 'sans' ? 'sans-serif' : 'serif'
            }}
          >
            {/* Dark overlay for better text readability if there's an image */}
            {bgImage && <div className="absolute inset-0 bg-black/40" />}
            
            <div className="relative z-10 text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg">{title || "Untitled"}</h2>
              <div className="text-6xl md:text-8xl font-black tabular-nums tracking-tighter drop-shadow-xl">
                {renderPreviewDisplay()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
