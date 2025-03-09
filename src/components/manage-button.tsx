"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export function ManageButton() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const response = await fetch("/api/auth/check-admin")
        const data = await response.json()
        setIsAdmin(data.isAdmin)
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      }
    }

    checkAdminStatus()
  }, [])

  if (!isAdmin) return null

  return (
    <Button variant="outline" size="icon" asChild>
      <Link href="/manage">
        <Settings className="h-4 w-4" />
      </Link>
    </Button>
  )
} 