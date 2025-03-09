import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isStreamer } from "@/lib/auth/isStreamer"

export async function GET(request: NextRequest) {
  try {
    // Verifica se é o streamer
    const isUserStreamer = await isStreamer()
    if (!isUserStreamer) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Pega os parâmetros da URL
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") || "approved"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Busca os posts
    const posts = await prisma.post.findMany({
      where: {
        status: status,
      },
      select: {
        id: true,
        title: true,
        description: true,
        contentLink: true,
        type: true,
        status: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip,
      take: limit,
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("[REACTION_POSTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 