"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { FaTwitch } from "react-icons/fa"

export function LoginButton() {
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full hover:bg-accent transition-all duration-200"
      onClick={() => signIn("twitch", { callbackUrl: "/" })}
    >
      <FaTwitch className="mr-3 h-5 w-5 text-[#9146FF]" />
      <span className="font-semibold">Entrar com Twitch</span>
    </Button>
  )
} 