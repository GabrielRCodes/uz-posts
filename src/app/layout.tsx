import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "uzPosts - Reação live",
  description: "Envie o seu conteúdo para ser reagido durante a live! Não mande nenhuma atrocidade, caso contrário, você será banido!",
  twitter: {
    card: "summary_large_image"
  },
  openGraph: {
    images: [
      {
        url: "https://res.cloudinary.com/dokdrggvz/image/upload/v1741551310/communityIcon_iv6lq9a34eb61_cay29d.png"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>{children}</NextAuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
