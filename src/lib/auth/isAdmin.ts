import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function isAdmin() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return false
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
      select: {
        permissionLevel: true
      }
    })

    return (user?.permissionLevel ?? 1000) <= 1
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
} 