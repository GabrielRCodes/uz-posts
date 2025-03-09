"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function ProfileHeaderReaction() {
  return (
    <div>
      <div className="relative">
        {/* Banner */}
        <div className="relative h-32 md:h-48 w-full overflow-hidden rounded-xl border">
          <Image
            src="https://res.cloudinary.com/dokdrggvz/image/upload/v1741551371/bannerBackgroundImage_18cjtxfh3fm61_gcndje.png"
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Avatar and Text */}
        <div className="container max-w-7xl">
          <div className="relative -mt-12 md:-mt-16 px-4">
            <div className="flex flex-col items-center gap-4 mb-[-50px]">
              <div className="h-24 w-24 md:h-32 md:w-32 relative rounded-full overflow-hidden border-4 border-background ring-2 ring-border">
                <Image
                  src="https://res.cloudinary.com/dokdrggvz/image/upload/v1741551310/communityIcon_iv6lq9a34eb61_cay29d.png"
                  alt="Avatar"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col items-center gap-4 w-full">
                <h1 className="text-2xl md:text-3xl font-bold text-center">Reações aos conteúdos</h1>
                <div className="flex items-center gap-2">
                  <ThemeSwitcher />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-12" />
    </div>
  )
} 