"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Props {
  type: "DATE" | "CONSTANT"
  targetDate: Date | null
  durationSeconds: number | null
}

export function CountdownDisplay({ type, targetDate, durationSeconds }: Props) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    isEnded: boolean
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: false })

  // We use a ref to track if we've shown the notification to prevent spamming
  const [notified, setNotified] = useState(false)

  useEffect(() => {
    let targetTimeMs: number

    if (type === "DATE" && targetDate) {
      targetTimeMs = new Date(targetDate).getTime()
    } else if (type === "CONSTANT" && durationSeconds) {
      // For CONSTANT, we start counting from "now" 
      // But wait, if someone refreshes, it resets. 
      // For this simple version, we'll store the end time in sessionStorage so it survives refresh within the same session
      const storageKey = `timer_end_\${durationSeconds}`
      const savedEnd = sessionStorage.getItem(storageKey)
      if (savedEnd) {
        targetTimeMs = parseInt(savedEnd)
      } else {
        targetTimeMs = Date.now() + durationSeconds * 1000
        sessionStorage.setItem(storageKey, targetTimeMs.toString())
      }
    } else {
      return
    }

    const interval = setInterval(() => {
      const now = Date.now()
      const diff = targetTimeMs - now

      if (diff <= 0) {
        clearInterval(interval)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true })
        if (!notified) {
          toast.success("Timer ended!")
          setNotified(true)
          
          // Request notification permission and show native push if allowed
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Timer Ended!", {
              body: "Your countdown has finished."
            })
          } else if ("Notification" in window && Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                new Notification("Timer Ended!", {
                  body: "Your countdown has finished."
                })
              }
            })
          }
        }
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isEnded: false
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [type, targetDate, durationSeconds, notified])

  if (timeLeft.isEnded) {
    return <div className="text-6xl md:text-9xl font-black drop-shadow-xl animate-bounce">00:00:00</div>
  }

  return (
    <div className="flex space-x-4 md:space-x-8 text-center drop-shadow-xl">
      {timeLeft.days > 0 && (
        <div className="flex flex-col">
          <span className="text-6xl md:text-9xl font-black tabular-nums tracking-tighter">{timeLeft.days}</span>
          <span className="text-lg md:text-2xl font-bold uppercase tracking-widest opacity-80">Days</span>
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-6xl md:text-9xl font-black tabular-nums tracking-tighter">{timeLeft.hours.toString().padStart(2, "0")}</span>
        <span className="text-lg md:text-2xl font-bold uppercase tracking-widest opacity-80">Hrs</span>
      </div>
      <div className="flex flex-col text-6xl md:text-9xl font-black tabular-nums tracking-tighter opacity-50 pb-8">:</div>
      <div className="flex flex-col">
        <span className="text-6xl md:text-9xl font-black tabular-nums tracking-tighter">{timeLeft.minutes.toString().padStart(2, "0")}</span>
        <span className="text-lg md:text-2xl font-bold uppercase tracking-widest opacity-80">Min</span>
      </div>
      <div className="flex flex-col text-6xl md:text-9xl font-black tabular-nums tracking-tighter opacity-50 pb-8">:</div>
      <div className="flex flex-col">
        <span className="text-6xl md:text-9xl font-black tabular-nums tracking-tighter">{timeLeft.seconds.toString().padStart(2, "0")}</span>
        <span className="text-lg md:text-2xl font-bold uppercase tracking-widest opacity-80">Sec</span>
      </div>
    </div>
  )
}
