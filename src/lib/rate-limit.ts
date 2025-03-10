import { prisma } from "./prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { differenceInHours } from "date-fns"

const LINK_LIMIT = 10
const IMAGE_LIMIT = 1

export async function checkRateLimit(type: "link" | "image") {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return false
  }

  const now = new Date()

  // Find or create rate limit record
  let rateLimit = await prisma.rateLimit.findUnique({
    where: {
      userId_type: {
        userId: session.user.id,
        type,
      },
    },
  })

  if (!rateLimit) {
    // Create new rate limit record
    rateLimit = await prisma.rateLimit.create({
      data: {
        userId: session.user.id,
        type,
        counter: 1,
        lastActivity: now,
      },
    })
    return true
  }

  // Check if it's been more than 24 hours since last activity
  const lastActivityDate = new Date(rateLimit.lastActivity)
  const hoursSinceLastActivity = differenceInHours(now, lastActivityDate)

  if (hoursSinceLastActivity >= 24) {
    // Reset counter if it's been more than 24 hours
    rateLimit = await prisma.rateLimit.update({
      where: {
        userId_type: {
          userId: session.user.id,
          type,
        },
      },
      data: {
        counter: 1,
        lastActivity: now,
      },
    })
    return true
  }

  // Check if limit reached
  const limit = type === "link" ? LINK_LIMIT : IMAGE_LIMIT
  if (rateLimit.counter >= limit) {
    return false
  }

  // Increment counter
  await prisma.rateLimit.update({
    where: {
      userId_type: {
        userId: session.user.id,
        type,
      },
    },
    data: {
      counter: rateLimit.counter + 1,
      lastActivity: now,
    },
  })

  return true
}

export async function getRateLimitInfo(type: "link" | "image") {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return {
      remaining: type === "link" ? LINK_LIMIT : IMAGE_LIMIT,
      total: type === "link" ? LINK_LIMIT : IMAGE_LIMIT,
    }
  }

  const rateLimit = await prisma.rateLimit.findUnique({
    where: {
      userId_type: {
        userId: session.user.id,
        type,
      },
    },
  })

  if (!rateLimit) {
    return {
      remaining: type === "link" ? LINK_LIMIT : IMAGE_LIMIT,
      total: type === "link" ? LINK_LIMIT : IMAGE_LIMIT,
    }
  }

  const limit = type === "link" ? LINK_LIMIT : IMAGE_LIMIT
  return {
    remaining: Math.max(0, limit - rateLimit.counter),
    total: limit,
  }
} 