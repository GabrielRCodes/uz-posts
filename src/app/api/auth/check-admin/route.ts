import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth/isAdmin"

export async function GET() {
  try {
    const adminStatus = await isAdmin()
    return NextResponse.json({ isAdmin: adminStatus })
  } catch (error) {
    console.error("Error in check-admin route:", error)
    return NextResponse.json({ isAdmin: false })
  }
} 