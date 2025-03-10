import { z } from "zod"

export const linkFormSchema = z.object({
  title: z.string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(150, "O título deve ter no máximo 150 caracteres"),
  url: z.string().url("URL inválida"),
  hasDescription: z.boolean().default(false),
  description: z.string().default(""),
}).refine(
  (data) => !data.hasDescription || data.description.length >= 10,
  {
    message: "A descrição deve ter pelo menos 10 caracteres quando habilitada",
    path: ["description"],
  }
).refine(
  (data) => !data.hasDescription || data.description.length <= 300,
  {
    message: "A descrição deve ter no máximo 300 caracteres",
    path: ["description"],
  }
)

export const imageFormSchema = z.object({
  title: z.string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(150, "O título deve ter no máximo 150 caracteres"),
  image: z.any().refine((file) => file?.length === 1, "Uma imagem é obrigatória"),
  hasDescription: z.boolean().default(false),
  description: z.string().default(""),
}).refine(
  (data) => !data.hasDescription || data.description.length >= 10,
  {
    message: "A descrição deve ter pelo menos 10 caracteres quando habilitada",
    path: ["description"],
  }
).refine(
  (data) => !data.hasDescription || data.description.length <= 300,
  {
    message: "A descrição deve ter no máximo 300 caracteres",
    path: ["description"],
  }
)

export type LinkFormData = z.infer<typeof linkFormSchema>
export type ImageFormData = z.infer<typeof imageFormSchema> 