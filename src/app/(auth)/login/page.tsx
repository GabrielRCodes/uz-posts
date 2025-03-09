import { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginButton } from "@/components/auth/LoginButton"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[450px] border shadow-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="space-y-4">
            <CardTitle className="text-3xl font-bold tracking-tight">Seja bem-vindo(a)</CardTitle>
            <CardDescription className="text-base">
              Realize o login para começar a enviar publicações que serão reagidas no canal.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid gap-6">
            <LoginButton />
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Não temos acesso à sua senha da twitch.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 