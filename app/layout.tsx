import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow_Semi_Condensed, JetBrains_Mono } from 'next/font/google'
import { ServiceWorkerRegister } from '@/components/dex/service-worker-register'
import './globals.css'

const barlow = Barlow_Semi_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-barlow',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'PokeThorAssistant · Tactical Pokédex & Battle Advisor',
  description:
    'Pokédex táctica para AYN Thor y consolas de emulación con pantalla dual: scanner de combate en tiempo real, VS Rival scout, builds óptimas competitivas, multi-equipo por ROM hack y base de datos offline de 1025 Pokémon.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050507',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`dark ${barlow.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <ServiceWorkerRegister />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
