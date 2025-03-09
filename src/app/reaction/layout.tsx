export default async function ReactionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-6xl py-8 px-4">
        {children}
      </div>
    </div>
  )
} 