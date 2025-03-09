import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import { authOptions } from "@/lib/auth"

interface HomeLayoutProps {
  children: ReactNode
}

export default async function HomeLayout({ children }: HomeLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 