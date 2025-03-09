"use client"

import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { RefreshCcwIcon } from "lucide-react"

export function HeaderButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.location.reload()}
      >
        <RefreshCcwIcon className="h-4 w-4" />
      </Button>
      <ThemeSwitcher />
    </div>
  )
} 