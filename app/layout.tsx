import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Механизированная штукатурка | Штукатур СПб',
  description: 'Профессиональная механизированная штукатурка стен и потолков в Санкт-Петербурге. Быстро, качественно, с гарантией 5 лет.',
  generator: 'Next.js',
  keywords: 'штукатурка, механизированная штукатурка, отделка стен, Санкт-Петербург',
  authors: [{ name: 'Штукатур СПб' }],
  openGraph: {
    title: 'Механизированная штукатурка | Штукатур СПб',
    description: 'Профессиональная механизированная штукатурка стен и потолков в Санкт-Петербурге',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
