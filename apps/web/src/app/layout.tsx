import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SaaS Academias',
  description: 'Plataforma de gestão para academias',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}