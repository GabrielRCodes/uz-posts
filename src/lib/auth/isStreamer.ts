import { cookies } from "next/headers"

export async function isStreamer() {
  try {
    const cookieStore = cookies()
    const streamerPassword = cookieStore.get("streamerPassword")?.value

    if (!streamerPassword) {
      return false
    }

    // Verifica se a senha bate com a do .env
    const envPassword = process.env.STREAMER_PASSWORD
    if (!envPassword) {
      console.error("STREAMER_PASSWORD não está definido no .env")
      return false
    }

    return streamerPassword === envPassword
  } catch (error) {
    console.error("Error checking streamer status:", error)
    return false
  }
} 