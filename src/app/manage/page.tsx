"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { PostList } from "./components/post-list"
import { useState } from "react"
import { toast } from "sonner"
import { ProfileHeader } from "./components/profile-header"

export default function ManagePage() {
  const [currentTab, setCurrentTab] = useState<string>("private")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTabChange = (value: string) => {
    if (isProcessing) {
      toast.error("Aguarde o processamento dos posts em andamento")
      return
    }
    setCurrentTab(value)
  }

  return (
    <div className="space-y-6">
      <ProfileHeader />

      <div className="container max-w-7xl px-4">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="private">Privados</TabsTrigger>
            <TabsTrigger value="approved">Aprovados</TabsTrigger>
          </TabsList>
          <TabsContent value="private" className="mt-6">
            <PostList 
              status="private" 
              onTabChange={(processing) => setIsProcessing(processing)} 
            />
          </TabsContent>
          <TabsContent value="approved" className="mt-6">
            <PostList 
              status="approved" 
              onTabChange={(processing) => setIsProcessing(processing)} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 