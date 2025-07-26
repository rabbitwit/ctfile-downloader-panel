import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '城通网盘下载器',
  description: 'Build with love by Nekohy',
  generator: 'github.com/Nekohy',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
