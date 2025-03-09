import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return new NextResponse("Senha não fornecida", { status: 400 })
    }

    const envPassword = process.env.STREAMER_PASSWORD
    if (!envPassword) {
      console.error("STREAMER_PASSWORD não está definido no .env")
      return new NextResponse("Erro interno", { status: 500 })
    }

    if (password !== envPassword) {
      return new NextResponse("Senha incorreta", { status: 401 })
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("[VERIFY_PASSWORD]", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
} 