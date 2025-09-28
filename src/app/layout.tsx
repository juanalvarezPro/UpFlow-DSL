import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { StructuredData } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UpFLows - Creador de Flujos de WhatsApp Business",
    template: "%s | UpFLows"
  },
  description: "Crea flujos interactivos para WhatsApp Business con sintaxis natural. Diseña conversaciones, formularios y experiencias de usuario sin código. Herramienta profesional para automatización de WhatsApp.",
  keywords: [
    "WhatsApp Business",
    "flujos de conversación",
    "automatización WhatsApp",
    "chatbot WhatsApp",
    "formularios WhatsApp",
    "sintaxis natural",
    "no-code",
    "creador de flujos",
    "automatización de mensajes",
    "WhatsApp API",
    "conversaciones interactivas",
    "bot WhatsApp",
    "flujos de trabajo",
    "automatización empresarial"
  ],
  authors: [{ name: "UpFLows Team" }],
  creator: "UpFLows",
  publisher: "UpFLows",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://upflows.juanalvarez.pro'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://upflows.juanalvarez.pro',
    title: 'UpFLows - Creador de Flujos de WhatsApp Business',
    description: 'Crea flujos interactivos para WhatsApp Business con sintaxis natural. Diseña conversaciones, formularios y experiencias de usuario sin código.',
    siteName: 'UpFLows',
    images: [
      {
        url: '/upflows-og-image.png',
        width: 1200,
        height: 630,
        alt: 'UpFLows - Creador de Flujos de WhatsApp Business',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UpFLows - Creador de Flujos de WhatsApp Business',
    description: 'Crea flujos interactivos para WhatsApp Business con sintaxis natural. Diseña conversaciones, formularios y experiencias de usuario sin código.',
    images: ['/upflows-twitter-card.png'],
    creator: '@upflows',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16.svg" sizes="16x16" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32.svg" sizes="32x32" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Meta tags optimizadas para WhatsApp y otras redes sociales */}
        <meta property="og:image" content="https://upflows.juanalvarez.pro/upflows-og-image.png" />
        <meta property="og:image:secure_url" content="https://upflows.juanalvarez.pro/upflows-og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="UpFLows - Creador de Flujos de WhatsApp Business" />
        
        {/* Meta tags adicionales para mejor compatibilidad */}
        <meta name="twitter:image:alt" content="UpFLows - Creador de Flujos de WhatsApp Business" />
        <meta name="twitter:site" content="@upflows" />
        <meta name="twitter:domain" content="upflows.juanalvarez.pro" />
        
        {/* Meta tags para LinkedIn y Facebook */}
        <meta property="fb:app_id" content="your-facebook-app-id" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:updated_time" content={new Date().toISOString()} />
        
        {/* Meta tags para Pinterest */}
        <meta name="pinterest-rich-pin" content="true" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
