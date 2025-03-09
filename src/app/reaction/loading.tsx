import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeaderReaction } from "./components/profile-header-reaction"

export default function LoadingReaction() {
  return (
    <div className="space-y-6">
      <ProfileHeaderReaction />

      <div className="container max-w-7xl px-4">
        <div className="space-y-4">
          <Tabs defaultValue="approved" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="approved">Aprovados</TabsTrigger>
              <TabsTrigger value="visualized">Visualizados</TabsTrigger>
            </TabsList>
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 