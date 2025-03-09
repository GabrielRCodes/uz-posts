import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isStreamer } from "@/lib/auth/isStreamer"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verifica se é o streamer
    const isUserStreamer = await isStreamer()
    if (!isUserStreamer) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = params
    const now = new Date()

    // Atualiza o post para visualizado e atualiza o updatedAt
    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        status: "visualized",
        updatedAt: now,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("[REACTION_POST_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 