"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export type CreateTimerInput = {
  title: string
  targetDate?: Date
  durationSeconds?: number
  type: "DATE" | "CONSTANT"
  font: string
  color: string
  bgImage?: string
  visibility: "PUBLIC" | "UNLISTED"
}

export async function createTimer(data: CreateTimerInput) {
  const session = await auth()
  
  const timer = await prisma.timer.create({
    data: {
      ...data,
      creatorId: session?.user?.id || null, // Guest timer if no session
    }
  })

  return timer
}

export async function getTimer(id: string) {
  const timer = await prisma.timer.findUnique({
    where: { id }
  })
  return timer
}

export async function getPublicTimers() {
  const timers = await prisma.timer.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: {
      savedBy: {
        _count: "desc"
      }
    },
    take: 20,
    include: {
      _count: {
        select: { savedBy: true }
      }
    }
  })
  return timers
}

export async function getUserTimers() {
  const session = await auth()
  if (!session?.user?.id) return []

  const timers = await prisma.timer.findMany({
    where: { creatorId: session.user.id },
    orderBy: { createdAt: "desc" }
  })
  return timers
}

export async function saveTimer(timerId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Must be logged in to save timers")

  const saved = await prisma.savedTimer.create({
    data: {
      userId: session.user.id,
      timerId
    }
  })
  return saved
}

export async function unsaveTimer(timerId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Must be logged in to unsave timers")

  await prisma.savedTimer.delete({
    where: {
      userId_timerId: {
        userId: session.user.id,
        timerId
      }
    }
  })
}

export async function getUserSavedTimers() {
  const session = await auth()
  if (!session?.user?.id) return []

  const saved = await prisma.savedTimer.findMany({
    where: { userId: session.user.id },
    include: { timer: true },
    orderBy: { createdAt: "desc" }
  })
  return saved.map(s => s.timer)
}
