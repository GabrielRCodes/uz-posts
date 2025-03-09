"use client"

import { Metadata } from "next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Stepper } from "@/components/ui/stepper"
import { Dropzone } from "@/components/ui/dropzone"
import { CheckCircle2, Loader2, LogOut } from "lucide-react"
import { FaTwitch } from "react-icons/fa"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { ImageUploader } from "@/lib/SendImage/ImageUploader"
import { toast } from "sonner"
import {
  imageFormSchema,
  linkFormSchema,
  type ImageFormData,
  type LinkFormData,
} from "@/lib/schemas/content-form"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { signOut } from "next-auth/react"
import { ManageButton } from "@/components/manage-button"

const steps = [
  {
    title: "Tipo de Conteúdo",
    description: "Escolha o tipo de conteúdo",
  },
  {
    title: "Informações",
    description: "Preencha os dados",
  },
  {
    title: "Concluído",
    description: "Conteúdo enviado",
  },
]

type ContentType = "link" | "image" | null

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

export default function HomePage() {
  const [step, setStep] = useState(0)
  const [contentType, setContentType] = useState<ContentType>(null)
  const [isLoading, setIsLoading] = useState(false)

  const linkForm = useForm<LinkFormData>({
    resolver: zodResolver(linkFormSchema),
  })

  const imageForm = useForm<ImageFormData>({
    resolver: zodResolver(imageFormSchema),
  })

  async function onSubmitLink(data: LinkFormData) {
    try {
      setIsLoading(true)
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          contentLink: data.url,
          type: "link",
          description: data.hasDescription ? data.description : "",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      setStep(2)
    } catch (error) {
      console.error("Error submitting link:", error)
      toast.error("Erro ao enviar o link. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmitImage(data: ImageFormData) {
    try {
      if (!data.image?.[0]) return
      
      const imageFile = data.image[0]
      
      if (imageFile.size > MAX_FILE_SIZE) {
        toast.error("A imagem deve ter no máximo 10MB")
        return
      }

      setIsLoading(true)

      try {
        const uploadResult = await ImageUploader({ image: imageFile })
        
        if (uploadResult.status !== 200) {
          throw new Error("Failed to upload image")
        }

        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: data.title,
            contentLink: uploadResult.image,
            type: "image",
            description: data.hasDescription ? data.description : "",
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create post")
        }

        setStep(2)
      } catch (error) {
        console.error("Error uploading image:", error)
        toast.error("Erro ao fazer upload da imagem. Tente novamente.")
      }
    } catch (error) {
      console.error("Error submitting image:", error)
      toast.error("Erro ao enviar a imagem. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleContentTypeSelect(type: ContentType) {
    setContentType(type)
    setStep(1)
  }

  function handleReset() {
    setStep(0)
    setContentType(null)
    linkForm.reset()
    imageForm.reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className={cn(
          "p-6 transition-all duration-300 relative",
          isLoading && "opacity-60"
        )}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] z-50 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {contentType === "image" ? "Enviando imagem..." : "Enviando link..."}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-0 mb-8">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Enviar Conteúdo</h1>
              <p className="text-sm text-muted-foreground">
                Envie um link ou imagem para ser reagido na live
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open("https://twitch.tv/yayahuz", "_blank")}
              >
                <FaTwitch className="h-4 w-4" />
              </Button>
              <ManageButton />
              <ThemeSwitcher />
              <Button
                variant="outline"
                size="icon"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Stepper steps={steps} currentStep={step} />

          <div className="mt-8 transition-all duration-300">
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Button
                  variant="outline"
                  className={cn(
                    "h-24 border-2 transition-all duration-300",
                    contentType === "link"
                      ? "border-primary"
                      : "border-input hover:border-primary"
                  )}
                  onClick={() => handleContentTypeSelect("link")}
                >
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">Link</div>
                    <div className="text-sm text-muted-foreground">
                      Envie um link do YouTube, Twitter, etc.
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className={cn(
                    "h-24 border-2 transition-all duration-300",
                    contentType === "image"
                      ? "border-primary"
                      : "border-input hover:border-primary"
                  )}
                  onClick={() => handleContentTypeSelect("image")}
                >
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">Imagem</div>
                    <div className="text-sm text-muted-foreground">
                      Envie uma imagem do seu computador
                    </div>
                  </div>
                </Button>
              </div>
            )}

            <div className="transition-all duration-300">
              {step === 1 && contentType === "link" && (
                <form onSubmit={linkForm.handleSubmit(onSubmitLink)} className="space-y-4 max-w-xl mx-auto">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Título
                    </label>
                    <Input
                      id="title"
                      placeholder="Digite um título para o conteúdo"
                      {...linkForm.register("title")}
                    />
                    {linkForm.formState.errors.title && (
                      <p className="text-sm text-destructive">
                        {linkForm.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hasDescription" className="text-sm font-medium">
                        Adicionar descrição
                      </Label>
                      <Switch
                        id="hasDescription"
                        checked={linkForm.watch("hasDescription")}
                        onCheckedChange={(checked) => {
                          linkForm.setValue("hasDescription", checked)
                          if (!checked) {
                            linkForm.setValue("description", "")
                          }
                        }}
                      />
                    </div>

                    {linkForm.watch("hasDescription") && (
                      <div>
                        <Textarea
                          id="description"
                          placeholder="Digite uma descrição para o conteúdo (mínimo 10 caracteres)"
                          {...linkForm.register("description")}
                          className="resize-none mt-2"
                          rows={3}
                        />
                        {linkForm.formState.errors.description && (
                          <p className="text-sm text-destructive mt-1">
                            {linkForm.formState.errors.description.message}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground text-right mt-1">
                          {linkForm.watch("description")?.length || 0}/300
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium">
                      URL
                    </label>
                    <Input
                      id="url"
                      placeholder="Cole o link aqui"
                      {...linkForm.register("url")}
                    />
                    {linkForm.formState.errors.url && (
                      <p className="text-sm text-destructive">
                        {linkForm.formState.errors.url.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(0)}
                    >
                      Voltar
                    </Button>
                    <Button type="submit">Enviar</Button>
                  </div>
                </form>
              )}

              {step === 1 && contentType === "image" && (
                <form onSubmit={imageForm.handleSubmit(onSubmitImage)} className="space-y-4 max-w-xl mx-auto">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Título
                    </label>
                    <Input
                      id="title"
                      placeholder="Digite um título para a imagem"
                      {...imageForm.register("title")}
                    />
                    {imageForm.formState.errors.title && (
                      <p className="text-sm text-destructive">
                        {imageForm.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hasDescription" className="text-sm font-medium">
                        Adicionar descrição
                      </Label>
                      <Switch
                        id="hasDescription"
                        checked={imageForm.watch("hasDescription")}
                        onCheckedChange={(checked) => {
                          imageForm.setValue("hasDescription", checked)
                          if (!checked) {
                            imageForm.setValue("description", "")
                          }
                        }}
                      />
                    </div>

                    {imageForm.watch("hasDescription") && (
                      <div>
                        <Textarea
                          id="description"
                          placeholder="Digite uma descrição para a imagem (mínimo 10 caracteres)"
                          {...imageForm.register("description")}
                          className="resize-none mt-2"
                          rows={3}
                        />
                        {imageForm.formState.errors.description && (
                          <p className="text-sm text-destructive mt-1">
                            {imageForm.formState.errors.description.message}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground text-right mt-1">
                          {imageForm.watch("description")?.length || 0}/300
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Imagem</label>
                    <Dropzone
                      onDrop={(files) => imageForm.setValue("image", files)}
                      error={imageForm.formState.errors.image?.message as string}
                      value={imageForm.watch("image")}
                      onChange={(files) => imageForm.setValue("image", files)}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(0)}
                    >
                      Voltar
                    </Button>
                    <Button type="submit">Enviar</Button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="text-center space-y-4 max-w-xl mx-auto py-8">
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Conteúdo Enviado!</h2>
                    <p className="text-muted-foreground">
                      Seu conteúdo foi enviado com sucesso e será analisado em breve.
                    </p>
                  </div>
                  <Button
                    onClick={handleReset}
                    className="mt-4"
                  >
                    Enviar Outro Conteúdo
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="sm:hidden flex items-center justify-between gap-2 mt-8 pt-4 border-t">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open("https://twitch.tv/yayahuz", "_blank")}
            >
              <FaTwitch className="h-4 w-4" />
            </Button>
            <ThemeSwitcher />
          </div>
        </Card>
      </div>
    </div>
  )
} 