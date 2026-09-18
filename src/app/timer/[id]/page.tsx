import { getTimer } from "@/actions/timer"
import { notFound } from "next/navigation"
import { CountdownDisplay } from "@/components/CountdownDisplay"
import { TimerActionBar } from "@/components/TimerActionBar"

export default async function TimerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const timer = await getTimer(params.id)
  
  if (!timer) {
    notFound()
  }

  return (
    <div 
      className="h-screen w-screen flex flex-col items-center justify-center bg-cover bg-center overflow-hidden relative"
      style={{
        backgroundImage: timer.bgImage ? `url(\${timer.bgImage})` : 'none',
        backgroundColor: timer.bgImage ? 'transparent' : '#111',
        color: timer.color,
        fontFamily: timer.font === 'sans' ? 'sans-serif' : 'serif'
      }}
    >
      {timer.bgImage && <div className="absolute inset-0 bg-black/50 z-0" />}
      
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight drop-shadow-2xl mb-8 text-center">
          {timer.title}
        </h1>
        
        <CountdownDisplay 
          targetDate={timer.targetDate}
          durationSeconds={timer.durationSeconds}
          type={timer.type as "DATE" | "CONSTANT"}
        />
      </div>

      <TimerActionBar timerId={timer.id} />
    </div>
  )
}
