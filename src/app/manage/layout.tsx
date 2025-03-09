import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function ManageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      permissionLevel: true,
    },
  })

  if (!user || user.permissionLevel > 1) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-6xl py-8 px-4">
        {children}
      </div>
    </div>
  )
} 