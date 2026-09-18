import { getPublicTimers } from "@/actions/timer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, Users, PlusCircle } from "lucide-react"
import Link from "next/link"
export const dynamic = 'force-dynamic';

export default async function Home() {
  const publicTimers = await getPublicTimers()

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <section className="py-20 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Community Countdowns
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          Create custom countdown timers for New Year, game releases, or personal events. Share them with the world and save the ones you love.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link href="/create">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Timer
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
              My Timers
            </Button>
          </Link>
        </div>
      </section>

      {/* Community Feed */}
      <section className="container mx-auto px-4 pb-24 max-w-6xl">
        <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-semibold flex items-center">
            <Users className="w-6 h-6 mr-3 text-zinc-400" />
            Popular Community Timers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {publicTimers.map((timer) => (
            <Link key={timer.id} href={`/timer/${timer.id}`}>
              <Card className="h-64 overflow-hidden relative group cursor-pointer border-0 rounded-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110 duration-700"
                  style={{ backgroundImage: timer.bgImage ? `url(${timer.bgImage})` : 'none', backgroundColor: timer.bgImage ? 'transparent' : '#222' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 transition-colors duration-500" />

                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <h3 className="font-bold text-xl leading-tight mb-2 truncate" style={{ color: timer.color, fontFamily: timer.font === 'sans' ? 'sans-serif' : 'serif' }}>
                    {timer.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{timer.type === "DATE" && timer.targetDate ? new Date(timer.targetDate).toLocaleDateString() : `${timer.durationSeconds}s`}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                      <Users className="w-3 h-3" />
                      <span>{timer._count.savedBy} saved</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {publicTimers.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
              No public timers found. Be the first to create one!
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
