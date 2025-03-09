import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import { authOptions } from "@/lib/auth"

interface AuthLayoutProps {
  children: ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return <>{children}</>
} 