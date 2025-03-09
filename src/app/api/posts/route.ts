import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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

    if ( !session ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        contentLink,
        type,
        description,
        status: "private",
        username: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
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