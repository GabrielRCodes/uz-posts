import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") || "private"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const posts = await prisma.post.findMany({
      where: {
        status,
      },
      orderBy: {
        [status === "private" ? "createdAt" : "updatedAt"]: "desc",
      },
      skip,
      take: limit,
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { title, contentLink, type, description } = await req.json()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check rate limit
    const canPost = await checkRateLimit(type as "link" | "image")
    if (!canPost) {
      return NextResponse.json(
        { error: `Você atingiu o limite diário de ${type === "link" ? "10 links" : "1 imagem"}` },
        { status: 429 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        contentLink,
        type,
        description,
        status: "private",
        username: session.user.name ?? "",
        email: session.user.email,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Error creating post" },
      { status: 500 }
    )
  }
} 