import { getUserTimers, getUserSavedTimers } from "@/actions/timer"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    // Basic redirect for protected route
    redirect("/api/auth/signin")
  }

  const [myTimers, savedTimers] = await Promise.all([
    getUserTimers(),
    getUserSavedTimers()
  ])

  return (
    <div className="container mx-auto p-4 max-w-5xl mt-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Link href="/create">
          <Button>Create New Timer</Button>
        </Link>
      </div>
      
      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">My Timers ({myTimers.length})</TabsTrigger>
          <TabsTrigger value="saved">Saved Timers ({savedTimers.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mine" className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {myTimers.length === 0 && <p className="text-muted-foreground">You haven't created any timers yet.</p>}
          {myTimers.map(timer => (
            <TimerCard key={timer.id} timer={timer} />
          ))}
        </TabsContent>
        
        <TabsContent value="saved" className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {savedTimers.length === 0 && <p className="text-muted-foreground">You haven't saved any timers yet.</p>}
          {savedTimers.map(timer => (
            <TimerCard key={timer.id} timer={timer} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TimerCard({ timer }: { timer: any }) {
  return (
    <Link href={\`/timer/\${timer.id}\`}>
      <Card className="h-48 overflow-hidden relative group cursor-pointer border-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105 duration-500"
          style={{ backgroundImage: timer.bgImage ? \`url(\${timer.bgImage})\` : 'none', backgroundColor: timer.bgImage ? 'transparent' : '#333' }}
        />
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
          <div className="font-semibold text-xl truncate">{timer.title}</div>
          <div className="flex items-center space-x-2 text-sm opacity-80">
            <Clock className="w-4 h-4" />
            <span>{timer.type === "DATE" ? new Date(timer.targetDate).toLocaleDateString() : \`\${timer.durationSeconds} sec\`}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
