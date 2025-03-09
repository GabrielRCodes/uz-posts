"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Cookies from "js-cookie"

interface PasswordModalProps {
  onSuccess: () => void
}

export function PasswordModal({ onSuccess }: PasswordModalProps) {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/reaction/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        throw new Error("Senha incorreta")
      }

      // Define o cookie com uma data de expiração bem distante (10 anos)
      Cookies.set("streamerPassword", password, { expires: 3650 })
      
      toast.success("Senha correta!")
      onSuccess()
    } catch (error) {
      toast.error("Senha incorreta")
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Digite a senha do streamer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verificando..." : "Entrar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 