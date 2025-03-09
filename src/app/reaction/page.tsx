"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostList } from "./components/post-list"
import { ProfileHeaderReaction } from "./components/profile-header-reaction"
import { PasswordModal } from "./components/password-modal"
import LoadingReaction from "./loading"
import Cookies from "js-cookie"

export default function ReactionPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const streamerPassword = Cookies.get("streamerPassword")
    if (streamerPassword) {
      // Verifica se a senha ainda é válida
      fetch("/api/reaction/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: streamerPassword }),
      })
        .then((response) => {
          if (response.ok) {
            setIsAuthenticated(true)
          } else {
            // Se a senha não for mais válida, remove o cookie
            Cookies.remove("streamerPassword")
          }
        })
        .catch(() => {
          Cookies.remove("streamerPassword")
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return <LoadingReaction />
  }

  return (
    <div className="space-y-6">
      <ProfileHeaderReaction />

      {!isAuthenticated ? (
        <PasswordModal onSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <div className="container max-w-7xl px-4">
          <div className="space-y-4">
            <Tabs defaultValue="approved" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="approved">Aprovados</TabsTrigger>
                <TabsTrigger value="visualized">Visualizados</TabsTrigger>
              </TabsList>
              <TabsContent value="approved">
                <PostList status="approved" />
              </TabsContent>
              <TabsContent value="visualized">
                <PostList status="visualized" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
} 