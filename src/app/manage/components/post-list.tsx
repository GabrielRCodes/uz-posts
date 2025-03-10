"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { InboxIcon, LinkIcon, UserIcon, ClockIcon, CheckCircleIcon, LockIcon, ImageIcon, Share2Icon, Maximize2Icon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Post {
  id: string
  title: string
  description: string
  contentLink: string
  type: string
  status: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

interface PostListProps {
  status: "private" | "approved"
  onTabChange: (isProcessing: boolean) => void
}

export function PostList({ status, onTabChange }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [firstLoading, setFirstLoading] = useState(true)
  const [processingPosts, setProcessingPosts] = useState<string[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { ref, inView } = useInView()

  async function fetchPosts(pageNumber: number, shouldAppend = true) {
    if (isLoading || (!hasMore && shouldAppend)) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/posts?status=${status}&page=${pageNumber}&limit=10`
      )
      const data = await response.json()

      if (data.posts.length < 10) {
        setHasMore(false)
      }

      setPosts(prev => shouldAppend ? [...prev, ...data.posts] : data.posts)
      setPage(pageNumber + 1)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoading(false)
      setFirstLoading(false)
    }
  }

  async function handleStatusChange(post: Post) {
    const newStatus = status === "private" ? "approved" : "private"
    const previousPosts = [...posts]
    
    // Adiciona o post à lista de processamento
    setProcessingPosts(prev => [...prev, post.id])
    
    // Atualização otimista: remove o post imediatamente
    setPosts((prev) => prev.filter((p) => p.id !== post.id))
    
    // Mostra notificação de sucesso
    toast.success(
      status === "private" 
        ? "Conteúdo aprovado com sucesso!"
        : "Conteúdo movido para privado!"
    )

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar o status")
      }
    } catch (error) {
      // Em caso de erro, reverte a alteração
      setPosts(previousPosts)
      toast.error(
        status === "private"
          ? "Erro ao aprovar o conteúdo. Tente novamente."
          : "Erro ao mover o conteúdo para privado. Tente novamente."
      )
    } finally {
      // Remove o post da lista de processamento
      setProcessingPosts(prev => prev.filter(id => id !== post.id))
    }
  }

  async function handleDelete(post: Post) {
    const previousPosts = [...posts]
    
    // Adiciona o post à lista de processamento
    setProcessingPosts(prev => [...prev, post.id])
    
    // Atualização otimista: remove o post imediatamente
    setPosts((prev) => prev.filter((p) => p.id !== post.id))
    
    // Mostra notificação de sucesso
    toast.success("Conteúdo deletado com sucesso!")

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao deletar o post")
      }
    } catch (error) {
      // Em caso de erro, reverte a alteração
      setPosts(previousPosts)
      toast.error("Erro ao deletar o conteúdo. Tente novamente.")
    } finally {
      // Remove o post da lista de processamento
      setProcessingPosts(prev => prev.filter(id => id !== post.id))
    }
  }

  // Efeito para carregar mais posts quando chegar ao final da lista
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      fetchPosts(page)
    }
  }, [inView])

  // Efeito para resetar e carregar posts quando mudar o status
  useEffect(() => {
    setPage(1)
    setHasMore(true)
    fetchPosts(1, false)
  }, [status])

  // Efeito para verificar se há posts sendo processados
  useEffect(() => {
    if (processingPosts.length > 0) {
      const handler = () => {
        toast.error("Aguarde o processamento dos posts em andamento")
        return false
      }
      
      window.addEventListener("beforeunload", handler)
      
      return () => {
        window.removeEventListener("beforeunload", handler)
      }
    }
  }, [processingPosts.length])

  // Notifica o componente pai sobre o estado de processamento
  useEffect(() => {
    onTabChange(processingPosts.length > 0)
  }, [processingPosts.length, onTabChange])

  if (firstLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center text-center">
        <InboxIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">Nenhum conteúdo encontrado</h3>
        <p className="text-muted-foreground">
          {status === "private"
            ? "Não há conteúdos aguardando aprovação."
            : "Não há conteúdos aprovados no momento."}
        </p>
      </Card>
    )
  }

  return (
    <>
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-screen-lg">
          <div className="relative aspect-[4/3] w-full">
            {previewImage && (
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-contain"
                draggable={false}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-4">
              <div className="space-y-4 w-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {post.title}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(post)}
                      className="flex-shrink-0"
                      disabled={processingPosts.includes(post.id)}
                    >
                      {processingPosts.includes(post.id) ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                          Processando...
                        </div>
                      ) : status === "private" ? (
                        <>
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Aprovar
                        </>
                      ) : (
                        <>
                          <LockIcon className="h-4 w-4 mr-2" />
                          Tornar Privado
                        </>
                      )}
                    </Button>
                  </div>
                  {post.description && (
                    <p className="text-sm text-muted-foreground">
                      {post.description}
                    </p>
                  )}
                  {post.type === "image" ? (
                    <div 
                      className="relative aspect-video bg-muted rounded-md overflow-hidden select-none group cursor-pointer"
                      onClick={() => setPreviewImage(post.contentLink)}
                    >
                      <Image
                        src={post.contentLink}
                        alt={post.title}
                        fill
                        className="object-contain"
                        draggable={false}
                      />
                      <div className="absolute top-2 right-2 p-2 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2Icon className="h-4 w-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <a
                        href={post.contentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline break-all flex items-center gap-2"
                      >
                        <LinkIcon className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{post.contentLink}</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span>{post.username || "Usuário Anônimo"} ({post.email})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {status === "approved" ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>
                          Aprovado {formatDistanceToNow(new Date(post.updatedAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </>
                    ) : (
                      <>
                        <ClockIcon className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(post)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={processingPosts.includes(post.id)}
                  >
                    {processingPosts.includes(post.id) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    ) : (
                      <Trash2Icon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {isLoading && !firstLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        <div ref={ref} className="h-4" />
      </div>
    </>
  )
} 